import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, BookOpen } from "lucide-react";

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

import { Label } from "@/components/ui/label";

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

function Books() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [editingBook, setEditingBook] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);

  const [deletingBook, setDeletingBook] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    year: "",
    stock: 0,
  });

  const getBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/books", {
        title: form.title,
        author: form.author,
        isbn: form.isbn,
        stock: Number(form.stock),
        category: form.category,
        year: Number(form.year),
      });

      setForm({
        title: "",
        author: "",
        category: "",
        isbn: "",
        year: "",
        stock: 0,
      });

      setOpenAdd(false);

      getBooks();
    } catch (error) {
      console.error(
        "Gagal:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message
      );
    }
  };

  const editBook = (book) => {

  setEditingBook({
    _id: book._id,
    title: book.title || "",
    author: book.author || "",
    category: book.category || "",
    isbn: book.isbn || "",
    year: book.year || "",
    stock: book.stock ?? 0,
  });

  setOpenEdit(true);
};

const handleEditSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.put(`/books/${editingBook._id}`, {
      title: editingBook.title,
      author: editingBook.author,
      category: editingBook.category,
      isbn: editingBook.isbn,
      year: Number(editingBook.year),
      stock: Number(editingBook.stock),
    });

    setOpenEdit(false);
    setEditingBook(null);

    getBooks();
  } catch (error) {
    console.error(
      "Gagal mengubah buku:",
      error.response?.data || error.message
    );

    alert(error.response?.data?.message);
  }
};

const deleteBook = (book) => {
  setDeletingBook(book);
  setOpenDelete(true);
};

const handleDelete = async () => {
  if (!deletingBook) {
    return;
  }

  try {
    await api.delete(`/books/${deletingBook._id}`);

    setOpenDelete(false);
    setDeletingBook(null);

    getBooks();
  } catch (error) {
    console.error(
      "Gagal menghapus buku:",
      error.response?.data || error.message
    );

    alert(error.response?.data?.message);
  }
};

  const filteredBooks = books.filter((book) => {
    const keyword = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(keyword) ||
      book.author?.toLowerCase().includes(keyword) ||
      book.category?.toLowerCase().includes(keyword) ||
      book.isbn?.toLowerCase().includes(keyword)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header halaman */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Daftar Buku
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Kelola koleksi buku Perpustakaan Digital UNSIA.
          </p>
        </div>

        {/* Toolbar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />

              <CardTitle className="text-base">
                Koleksi Buku
              </CardTitle>
            </div>

            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger
  render={
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Tambah Buku
    </Button>
  }
/>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Buku</DialogTitle>

                  <DialogDescription>
                    Masukkan informasi buku yang akan ditambahkan.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Judul
                    </Label>

                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          title: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">
                      Penulis
                    </Label>

                    <Input
                      id="author"
                      value={form.author}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          author: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Kategori
                      </Label>

                      <Input
                        id="category"
                        value={form.category}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            category: e.target.value,
                          })
                        }
                        
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">
                        Tahun
                      </Label>

                      <Input
                        id="year"
                        type="number"
                        value={form.year}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            year: e.target.value,
                          })
                        }
                        
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label htmlFor="isbn">
                        ISBN
                      </Label>

                      <Input
                        id="isbn"
                        value={form.isbn}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            isbn: e.target.value,
                          })
                        }
                        
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">
                        Stok
                      </Label>

                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            stock: e.target.value,
                          })
                        }
                        
                      />
                    </div>

                  </div>

                  <DialogFooter>
                    <Button type="submit">
                      Simpan Buku
                    </Button>
                  </DialogFooter>

                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Edit Buku</DialogTitle>

      <DialogDescription>
        Ubah informasi buku yang dipilih.
      </DialogDescription>
    </DialogHeader>

    {editingBook && (
      <form
        onSubmit={handleEditSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="edit-title">
            Judul
          </Label>

          <Input
            id="edit-title"
            value={editingBook.title}
            onChange={(e) =>
              setEditingBook({
                ...editingBook,
                title: e.target.value,
              })
            }
            
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-author">
            Penulis
          </Label>

          <Input
            id="edit-author"
            value={editingBook.author}
            onChange={(e) =>
              setEditingBook({
                ...editingBook,
                author: e.target.value,
              })
            }
            
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category">
              Kategori
            </Label>

            <Input
              id="edit-category"
              value={editingBook.category}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  category: e.target.value,
                })
              }
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-year">
              Tahun
            </Label>

            <Input
              id="edit-year"
              type="number"
              value={editingBook.year}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  year: e.target.value,
                })
              }
              
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-isbn">
              ISBN
            </Label>

            <Input
              id="edit-isbn"
              value={editingBook.isbn}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  isbn: e.target.value,
                })
              }
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-stock">
              Stok
            </Label>

            <Input
              id="edit-stock"
              type="number"
              min="0"
              value={editingBook.stock}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  stock: e.target.value,
                })
              }
              
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenEdit(false)}
          >
            Batal
          </Button>

          <Button type="submit">
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </form>
    )}
  </DialogContent>
</Dialog>
          </CardHeader>

          <CardContent>

            {/* Search */}
            <div className="mb-4 relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Cari buku..."
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

                    <TableHead>Judul</TableHead>

                    <TableHead>Penulis</TableHead>

                    <TableHead>Kategori</TableHead>

                    <TableHead>ISBN</TableHead>

                    <TableHead>Tahun</TableHead>

                    <TableHead>Stok</TableHead>

                    <TableHead className="text-right">
                      Aksi
                    </TableHead>

                  </TableRow>
                </TableHeader>

                <TableBody>

                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <TableRow key={book._id}>

                        <TableCell className="font-medium">
                          {book.title}
                        </TableCell>

                        <TableCell>
                          {book.author}
                        </TableCell>

                        <TableCell>
                          {book.category}
                        </TableCell>

                        <TableCell>
                          {book.isbn}
                        </TableCell>

                        <TableCell>
                          {book.year}
                        </TableCell>

                        <TableCell>
                          {book.stock}
                        </TableCell>

                        <TableCell className="text-right">

                          <div className="flex justify-end gap-2">

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                editBook(book)
                              }
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>deleteBook(book)}
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
                        Tidak ada data buku.
                      </TableCell>
                    </TableRow>
                  )}

                </TableBody>

              </Table>

            </div>

          </CardContent>
        </Card>

 <AlertDialog
  open={openDelete}
  onOpenChange={setOpenDelete}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Hapus buku?
      </AlertDialogTitle>

      <AlertDialogDescription>
        Apakah kamu yakin ingin menghapus buku{" "}
        <span className="font-semibold text-foreground">
          "{deletingBook?.title}"
        </span>
        ?
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

export default Books;