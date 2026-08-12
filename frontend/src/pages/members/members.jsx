import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";

import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

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

function Members() {
  const [members, setMembers] = useState([]);

  const [search, setSearch] = useState("");

  // Tambah
  const [openAdd, setOpenAdd] = useState(false);

  // Edit
  const [openEdit, setOpenEdit] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Hapus
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    memberCode: "",
  });

  const getMembers = async () => {
    try {
      const response = await api.get("/members");
      setMembers(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data member:", error);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  // =========================
  // TAMBAH MEMBER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/members", form);

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        memberCode: "",
      });

      setOpenAdd(false);

      getMembers();
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

  // =========================
  // EDIT MEMBER
  // =========================

  const editMember = (member) => {
    setEditingMember({
      _id: member._id,
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      address: member.address || "",
      memberCode: member.memberCode || "",
    });

    setOpenEdit(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingMember) {
      return;
    }

    try {
      await api.put(`/members/${editingMember._id}`, {
        name: editingMember.name,
        email: editingMember.email,
        phone: editingMember.phone,
        address: editingMember.address,
        memberCode: editingMember.memberCode,
      });

      setOpenEdit(false);
      setEditingMember(null);

      getMembers();
    } catch (error) {
      console.error(
        "Gagal mengubah member:",
        error.response?.data || error.message
      );

      alert(error.response?.data?.message);
    }
  };

  // =========================
  // HAPUS MEMBER
  // =========================

  const deleteMember = (member) => {
    setDeletingMember(member);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    if (!deletingMember) {
      return;
    }

    try {
      await api.delete(`/members/${deletingMember._id}`);

      setOpenDelete(false);
      setDeletingMember(null);

      getMembers();
    } catch (error) {
      console.error(
        "Gagal menghapus member:",
        error.response?.data || error.message
      );

      alert(error.response?.data?.message);
    }
  };

  // =========================
  // PENCARIAN
  // =========================

  const filteredMembers = members.filter((member) => {
    const keyword = search.toLowerCase();

    return (
      member.name?.toLowerCase().includes(keyword) ||
      member.email?.toLowerCase().includes(keyword) ||
      member.phone?.toLowerCase().includes(keyword) ||
      member.address?.toLowerCase().includes(keyword) ||
      member.memberCode?.toLowerCase().includes(keyword)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header halaman */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Daftar Member
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Kelola data member Perpustakaan Digital UNSIA.
          </p>
        </div>

        {/* Card Member */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />

              <CardTitle className="text-base">
                Data Member
              </CardTitle>
            </div>

            {/* Dialog Tambah */}
            <Dialog
              open={openAdd}
              onOpenChange={setOpenAdd}
            >
              <DialogTrigger
  render={
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Tambah Member
    </Button>
  }
/>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    Tambah Member
                  </DialogTitle>

                  <DialogDescription>
                    Masukkan informasi member yang akan
                    ditambahkan.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Nama */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nama
                    </Label>

                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Telepon */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      No. Telepon
                    </Label>

                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Kode Member */}
                  <div className="space-y-2">
                    <Label htmlFor="memberCode">
                      Kode Member
                    </Label>

                    <Input
                      id="memberCode"
                      value={form.memberCode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          memberCode: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Alamat */}
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Alamat
                    </Label>

                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          address: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  <DialogFooter>
                    <Button type="submit">
                      Simpan Member
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
                placeholder="Cari member..."
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
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kode Member</TableHead>
                    <TableHead className="text-right">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <TableRow key={member._id}>

                        <TableCell className="font-medium">
                          {member.name}
                        </TableCell>

                        <TableCell>
                          {member.email}
                        </TableCell>

                        <TableCell>
                          {member.phone}
                        </TableCell>

                        <TableCell>
                          {member.address}
                        </TableCell>

                        <TableCell>
                          {member.memberCode}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">

                            {/* Edit */}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                editMember(member)
                              }
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Hapus */}
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                deleteMember(member)
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
                        colSpan={6}
                        className="h-24 text-center"
                      >
                        Tidak ada data member.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </div>

          </CardContent>
        </Card>

        {/* ========================= */}
        {/* DIALOG EDIT */}
        {/* ========================= */}

        <Dialog
          open={openEdit}
          onOpenChange={setOpenEdit}
        >
          <DialogContent className="sm:max-w-[500px]">

            <DialogHeader>
              <DialogTitle>
                Edit Member
              </DialogTitle>

              <DialogDescription>
                Ubah informasi member yang dipilih.
              </DialogDescription>
            </DialogHeader>

            {editingMember && (
              <form
                onSubmit={handleEditSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="edit-name">
                    Nama
                  </Label>

                  <Input
                    id="edit-name"
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        name: e.target.value,
                      })
                    }
                    
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">
                    Email
                  </Label>

                  <Input
                    id="edit-email"
                    type="email"
                    value={editingMember.email}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        email: e.target.value,
                      })
                    }
                    
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">
                    No. Telepon
                  </Label>

                  <Input
                    id="edit-phone"
                    value={editingMember.phone}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        phone: e.target.value,
                      })
                    }
                    
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-memberCode">
                    Kode Member
                  </Label>

                  <Input
                    id="edit-memberCode"
                    value={editingMember.memberCode}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        memberCode: e.target.value,
                      })
                    }
                    
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address">
                    Alamat
                  </Label>

                  <Input
                    id="edit-address"
                    value={editingMember.address}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        address: e.target.value,
                      })
                    }
                  />
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

        {/* ========================= */}
        {/* ALERT DIALOG HAPUS */}
        {/* ========================= */}

        <AlertDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
        >
          <AlertDialogContent>

            <AlertDialogHeader>
              <AlertDialogTitle>
                Hapus member?
              </AlertDialogTitle>

              <AlertDialogDescription>
                Apakah kamu yakin ingin menghapus member{" "}
                <span className="font-semibold text-foreground">
                  "{deletingMember?.name}"
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

export default Members;