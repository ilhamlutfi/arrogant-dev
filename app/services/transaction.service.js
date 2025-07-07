import prisma from "../../prisma/client.js";
import dayjs from "dayjs";
import 'dayjs/locale/id.js';
import formatRupiah from "../helpers/rupiah.helper.js";

class TransactionService {

    create = async (data) => {
        const transaction = await prisma.transaction.create({ data });
        return transaction;
    }

    // transaksi terbaru
    getLatestTransactions = async () => {
        const currentMonthData = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

         // Format tanggal ke "29 November 2021"
         const formatted = currentMonthData.map(item => ({
             ...item,
             transactionDateFormatted: dayjs(item.transactionDate)
                 .locale('id')
                 .format('DD MMMM YYYY'),
             amountFormatted: formatRupiah(item.amount),
         }));

        return formatted;
    }

    // arsip transaksi
    getArchivedMonths = async () => {
        const all = await prisma.transaction.findMany({
            select: {
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const unique = [];

        for (const t of all) {
            const year = t.createdAt.getFullYear();
            const month = t.createdAt.getMonth() + 1;

            const exists = unique.find(u => u.year === year && u.month === month);
            if (!exists) unique.push({
                year,
                month,
                namaBulan: dayjs().month(month - 1).locale('id').format('MMMM')
            });
        }

        return unique;
    };

    // arsip perbulan
    getByMonthYear = async (bulan, tahun) => {
        const awalBulan = new Date(tahun, bulan - 1, 1);
        const akhirBulan = new Date(tahun, bulan, 0, 23, 59, 59);

        const transaksi = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: awalBulan,
                    lte: akhirBulan
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return transaksi.map(item => ({
            ...item,
            transactionDateFormatted: dayjs(item.transactionDate).locale('id').format('DD MMMM YYYY'),
            amountFormatted: formatRupiah(item.amount),
            typeClass: item.type === 'income' ? 'text-success' : 'text-danger',
            typeLabel: item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'
        }));
    }
}

export default new TransactionService();
