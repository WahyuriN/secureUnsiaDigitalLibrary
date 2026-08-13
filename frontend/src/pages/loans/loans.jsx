import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  RotateCcw,
  BookMarked,
} from "lucide-react";

import api from "../../services/api";
import DashboardLayout from "../../layouts/dashboardLayout";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";

function Loans() {
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  // Dialog tambah
  const [openAdd, setOpenAdd] = useState(false);

  // Alert hapus
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingLoan, setDeletingLoan] = useState(null);

  // Alert kembalikan
  const [openReturn, setOpenReturn] = useState(false);
  const [returningLoan, setReturningLoan] = useState(null);

  const [form, setForm] = useState({
    member: "",
    book: "",
    loanDate: "",
    dueDate: "",
  });

  // =========================
  // GET DATA
  // =========================

  const getLoans = async () => {
    try {
      const response = await api.get("/loans");
      setLoans(response.data.data);
    } catch (error) {
      console.error(
        "Gagal mengambil data peminjaman:",
        error
      );
    }
  };

  const getMembers = async () => {
    try {
      const response = await api.get("/members");
      setMembers(response.data.data);
    } catch (error) {
      console.error(
        "Gagal mengambil data member:",
        error
      );
    }
  };

  const getBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.data);
    } catch (error) {
      console.error(
        "Gagal mengambil data buku:",
        error
      );
    }
  };

  useEffect(() => {
    getLoans();
    getMembers();
    getBooks();
  }, []);

  // =========================
  // TAMBAH PEMINJAMAN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/loans", form);

      setForm({
        member: "",
        book: "",
        loanDate: "",
        dueDate: "",
      });

      setOpenAdd(false);

      getLoans();
      getBooks();
    } catch (error) {
      console.error(
        "Gagal menambahkan peminjaman:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message
      );
    }
  };

  // =========================
  // KEMBALIKAN BUKU
  // =========================

  const returnLoan = (loan) => {
    setReturningLoan(loan);
    setOpenReturn(true);
  };

  const handleReturn = async () => {
    if (!returningLoan) {
      return;
    }

    try {
      await api.put(
        `/loans/${returningLoan._id}/return`
      );

      setOpenReturn(false);
      setReturningLoan(null);

      getLoans();
      getBooks();
    } catch (error) {
      console.error(
        "Gagal mengembalikan buku:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message
      );
    }
  };

  // =========================
  // HAPUS PEMINJAMAN
  // =========================

  const deleteLoan = (loan) => {
    setDeletingLoan(loan);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    if (!deletingLoan) {
      return;
    }

    try {
      await api.delete(
        `/loans/${deletingLoan._id}`
      );

      setOpenDelete(false);
      setDeletingLoan(null);

      getLoans();
    } catch (error) {
      console.error(
        "Gagal menghapus peminjaman:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message
      );
    }
  };

  // =========================
  // PENCARIAN
  // =========================

  const filteredLoans = loans.filter((loan) => {
    const keyword = search.toLowerCase();

    return (
      loan.member?.name
        ?.toLowerCase()
        .includes(keyword) ||
      loan.member?.memberCode
        ?.toLowerCase()
        .includes(keyword) ||
      loan.book?.title
        ?.toLowerCase()
        .includes(keyword) ||
      loan.status
        ?.toLowerCase()
        .includes(keyword)
    );
  });

  // =========================
  // FORMAT TANGGAL
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Peminjaman
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Kelola data peminjaman dan pengembalian buku.
          </p>
        </div>

        {/* Card */}
        <Card>

          <CardHeader className="flex flex-row items-center justify-between">

            <div className="flex items-center gap-2">
              <BookMarked className="h-5 w-5" />

              <CardTitle className="text-base">
                Data Peminjaman
              </CardTitle>
            </div>

            {/* Tambah */}
            <Dialog
              open={openAdd}
              onOpenChange={setOpenAdd}
            >
              <DialogTrigger
  render={
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Tambah Peminjaman
    </Button>
  }
/>

              <DialogContent className="sm:max-w-[500px]">

                <DialogHeader>
                  <DialogTitle>
                    Tambah Peminjaman
                  </DialogTitle>

                  <DialogDescription>
                    Pilih member, buku, , tanggal peminjaman, dan tanggal jatuh
                    tempo peminjaman.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* Member */}
                  <div className="space-y-2">
                    <Label htmlFor="member">
                      Member
                    </Label>

                    <select
                      id="member"
                      value={form.member}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          member: e.target.value,
                        })
                      }
                      
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">
                        Pilih Member
                      </option>

                      {members.map((member) => (
                        <option
                          key={member._id}
                          value={member._id}
                        >
                          {member.name} -{" "}
                          {member.memberCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buku */}
                  <div className="space-y-2">
                    <Label htmlFor="book">
                      Buku
                    </Label>

                    <select
                      id="book"
                      value={form.book}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          book: e.target.value,
                        })
                      }
                      
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">
                        Pilih Buku
                      </option>

                      {books.map((book) => (
                        <option
                          key={book._id}
                          value={book._id}
                        >
                          {book.title} — Stok:{" "}
                          {book.stock}
                        </option>
                      ))}
                    </select>
                  </div>

{/* Tanggal Peminjaman */}
<div className="space-y-2">
  <Label htmlFor="loanDate">
    Tanggal Peminjaman
  </Label>

  <Input
    id="loanDate"
    type="date"
    value={form.loanDate}
    onChange={(e) =>
      setForm({
        ...form,
        loanDate: e.target.value,
      })
    }
    
  />
</div>

                  {/* Jatuh tempo */}
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">
                      Jatuh Tempo
                    </Label>

                    <Input
                      id="dueDate"
                      type="date"
                      value={form.dueDate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          dueDate: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  <DialogFooter>
                    <Button type="submit">
                      Simpan Peminjaman
                    </Button>
                  </DialogFooter>

                </form>
              </DialogContent>
            </Dialog>

          </CardHeader>

          <CardContent>

            {/* Search */}
            <div className="relative mb-4 max-w-sm">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Cari peminjaman..."
                className="pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* Table */}
            <div className="rounded-md border">

              <Table>

                <TableHeader>
                  <TableRow>

                    <TableHead>
                      Member
                    </TableHead>

                    <TableHead>
                      Buku
                    </TableHead>

                    <TableHead>
                      Tanggal Pinjam
                    </TableHead>

                    <TableHead>
                      Jatuh Tempo
                    </TableHead>

                    <TableHead>
                      Tanggal Kembali
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead className="text-right">
                      Aksi
                    </TableHead>

                  </TableRow>
                </TableHeader>

                <TableBody>

                  {filteredLoans.length > 0 ? (

                    filteredLoans.map((loan) => (

                      <TableRow key={loan._id}>

                        <TableCell className="font-medium">
                          {loan.member?.name || "-"}
                        </TableCell>

                        <TableCell>
                          {loan.book?.title || "-"}
                        </TableCell>

                        <TableCell>
                          {formatDate(loan.loanDate)}
                        </TableCell>

                        <TableCell>
                          {formatDate(loan.dueDate)}
                        </TableCell>

                        <TableCell>
                          {formatDate(loan.returnDate)}
                        </TableCell>

                        <TableCell>

                          {loan.status === "borrowed" ? (
                            <Badge>
                              Dipinjam
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Dikembalikan
                            </Badge>
                          )}

                        </TableCell>

                        <TableCell className="text-right">

                          <div className="flex justify-end gap-2">

                            {/* Kembalikan */}
                            {loan.status === "borrowed" && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  returnLoan(loan)
                                }
                                title="Kembalikan"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Hapus */}
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                deleteLoan(loan)
                              }
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                          </div>

                        </TableCell>

                      </TableRow>

                    ))

                  ) : (

                    <TableRow>

                      <TableCell
                        colSpan={7}
                        className="h-24 text-center"
                      >
                        Tidak ada data peminjaman.
                      </TableCell>

                    </TableRow>

                  )}

                </TableBody>

              </Table>

            </div>

          </CardContent>

        </Card>

        {/* ========================= */}
        {/* ALERT KEMBALIKAN */}
        {/* ========================= */}

        <AlertDialog
          open={openReturn}
          onOpenChange={setOpenReturn}
        >

          <AlertDialogContent>

            <AlertDialogHeader>

              <AlertDialogTitle>
                Kembalikan buku?
              </AlertDialogTitle>

              <AlertDialogDescription>

                Apakah buku{" "}
                <span className="font-semibold text-foreground">
                  "{returningLoan?.book?.title}"
                </span>{" "}
                akan dikembalikan oleh{" "}
                <span className="font-semibold text-foreground">
                  "{returningLoan?.member?.name}"
                </span>
                ?

              </AlertDialogDescription>

            </AlertDialogHeader>

            <AlertDialogFooter>

              <AlertDialogCancel>
                Batal
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleReturn}
              >
                Kembalikan
              </AlertDialogAction>

            </AlertDialogFooter>

          </AlertDialogContent>

        </AlertDialog>

        {/* ========================= */}
        {/* ALERT HAPUS */}
        {/* ========================= */}

        <AlertDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
        >

          <AlertDialogContent>

            <AlertDialogHeader>

              <AlertDialogTitle>
                Hapus peminjaman?
              </AlertDialogTitle>

              <AlertDialogDescription>

                Apakah kamu yakin ingin menghapus data
                peminjaman{" "}
                <span className="font-semibold text-foreground">
                  "{deletingLoan?.book?.title}"
                </span>
                ?

                <br />

              </AlertDialogDescription>

            </AlertDialogHeader>

            <AlertDialogFooter>

              <AlertDialogCancel>
                Batal
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Hapus
              </AlertDialogAction>

            </AlertDialogFooter>

          </AlertDialogContent>

        </AlertDialog>

      </div>
    </DashboardLayout>
  );
}

export default Loans;