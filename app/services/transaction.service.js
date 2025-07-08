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
            take: 10,
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
            take: 10,
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
    getTransactionsByMonth = async (year, month) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const transactions = await prisma.transaction.findMany({
            take: 10,
            where: {
                transactionDate: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: {
                transactionDate: 'desc',
            },
        });

        let totalIncome = 0;
        let totalExpense = 0;

        const formatted = transactions.map(item => {
            const isIncome = item.type === 'income';

            // Gunakan nilai mentah amount, bukan hasil formatRupiah
            if (isIncome) {
                totalIncome += Number(item.amount); // ✅ Convert string to number
            } else {
                totalExpense += Number(item.amount); // ✅ Convert string to number
            }

            return {
                ...item,
                amountFormatted: formatRupiah(item.amount),
                transactionDateFormatted: dayjs(item.transactionDate).locale('id').format('DD MMMM YYYY'),
                typeClass: isIncome ? 'text-success' : 'text-danger',
                typeLabel: isIncome ? 'Pemasukan' : 'Pengeluaran',
            };
        });

        return {
            transactions: formatted,
            totalIncome: formatRupiah(totalIncome), // Format di akhir
            totalExpense: formatRupiah(totalExpense),
        };
    }
    
    // by id
    getTransactionById = async (id) => {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!transaction) {
            throw new Error('NOT_FOUND');
        }

        // format value
        transaction.transactionDate = transaction.transactionDateFormatted = transaction.transactionDate.toISOString().slice(0, 10);

        return transaction;
    }

    // 

    // update
    updateTransaction = async (id, data) => {
         // Pastikan transaksi ada (kalau tidak, akan throw error)
         await prisma.transaction.findUniqueOrThrow({
            where: { id: parseInt(id) }
        });

        // Proses update
        const updated = await prisma.transaction.update({
            where: {
                id: parseInt(id)
            },
            data: {
                transactionDate: new Date(data.transactionDate),
                description: data.description,
                amount: parseFloat(data.amount),
                type: data.type,
                userId: data.userId
            }
        });

        return updated;
    }
}

export default new TransactionService();
