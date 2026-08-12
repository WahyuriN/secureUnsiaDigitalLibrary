import { useEffect, useState } from "react";
import { BookOpen, Users, BookMarked } from "lucide-react";

import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalAvailableBooks, setTotalAvailableBooks] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);


  const [loanChart, setLoanChart] = useState({
    
    labels: [],
    datasets: [],
  });

useEffect(() => {
  const getDashboardData = async () => {
    try {
      const response = await api.get("/dashboard/summary");

      const data = response.data.data;

      setTotalBooks(data.totalBooks);
      setTotalAvailableBooks(data.totalAvailableBooks);
      setTotalMembers(data.totalMembers);
      setTotalLoans(data.totalLoans);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];

      const monthlyLoans = Array(12).fill(0);

      data.loansByMonth.forEach((item) => {
        const monthIndex = item._id.month - 1;

        monthlyLoans[monthIndex] = item.total;
      });

      setLoanChart({
        labels: months,
        datasets: [
          {
            label: "Jumlah Peminjaman",
            data: monthlyLoans,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
        ],
      });
    } catch (error) {
      console.error(
        "Gagal mengambil data dashboard:",
        error
      );
    }
  };

  getDashboardData();
}, []);
  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan aktivitas Perpustakaan Digital UNSIA.
          </p>
        </div>

        {/* Statistic Cards */}
        <div className="grid gap-4 md:grid-cols-4">

          {/* Total Buku */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Buku
              </CardTitle>

              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {totalBooks}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Koleksi buku
              </p>
            </CardContent>
          </Card>

          {/* Total Buku Tersedia */}
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">
      Buku Tersedia
    </CardTitle>

    <BookOpen className="h-4 w-4 text-muted-foreground" />
  </CardHeader>

  <CardContent>
    <div className="text-3xl font-bold">
      {totalAvailableBooks}
    </div>

    <p className="mt-1 text-xs text-muted-foreground">
      Total stok buku
    </p>
  </CardContent>
</Card>

          {/* Total Member */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Member
              </CardTitle>

              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {totalMembers}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Member terdaftar
              </p>
            </CardContent>
          </Card>

          {/* Total Peminjaman */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Peminjaman
              </CardTitle>

              <BookMarked className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {totalLoans}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Data peminjaman
              </p>
            </CardContent>
          </Card>

        </div>

{/* Loan Statistics */}
<Card>
  <CardHeader>
    <CardTitle className="text-base font-semibold">
      Statistik Peminjaman
    </CardTitle>

    <p className="text-sm text-muted-foreground">
      Jumlah peminjaman buku berdasarkan bulan.
    </p>
  </CardHeader>

  <CardContent>
    <div className="h-[280px] w-full">
      <Bar
        data={loanChart}
        options={{
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              position: "top",
            },
          },

          scales: {
            x: {
              grid: {
                display: false,
              },
            },

            y: {
              beginAtZero: true,

              ticks: {
                precision: 0,
                stepSize: 1,
              },
            },
          },
        }}
      />
    </div>
  </CardContent>
</Card>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;