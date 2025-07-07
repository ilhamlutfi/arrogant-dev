import RequestValidator from "../config/validator.js";
import { render } from "../config/view.js";
import { storeTransactionValidate } from "../validations/transaction.validation.js";
import prisma from "../../prisma/client.js";
import TransactionService from "../services/transaction.service.js";
import dayjs from "dayjs";
import 'dayjs/locale/id.js';

class transactionController {
    constructor() {
        this.transactionService = TransactionService;
    } 

    index = async (req, res) => {
        return render('transaction/index', {
            transactions: await this.transactionService.getLatestTransactions()
        }, req, res);
    }

    archive = async (req, res) => {
        return render('transaction/archive', {
            archives: await this.transactionService.getArchivedMonths()
        }, req, res);
    }

    byMonth = async (req, res) => {
        const { year, month } = req.params;

        const { transactions, totalIncome, totalExpense } = await this.transactionService.getTransactionsByMonth(year, month);

        const namaBulan = dayjs().month(month - 1).locale('id').format('MMMM');

        return render('transaction/by-month', {
            transactions,
            bulan: month,
            tahun: year,
            namaBulan,
            totalIncome,
            totalExpense
        }, req, res);
    }

    create = async (req, res) => {
        return render('transaction/create', {}, req, res);
    }

    store = async (req, res) => {
        try {
            const errors = await RequestValidator.validate(req, storeTransactionValidate.rules());

            if (errors) {
                return res.status(422).json({
                    errors
                });
            }

            const { transactionDate, description, amount, type } = req.body;
            const userId = req.session?.user?.id || 1;

            const data = {
                transactionDate: new Date(transactionDate),
                description,
                amount: parseFloat(amount),
                type,
                userId
            };

            const transaction = await prisma.transaction.create({
                data,
            });

            return res.status(201).json({
                success: true,
                message: 'Berhasil menambahkan transaksi',
                redirect: '/transactions',
                transaction
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Terjadi kesalahan: ' + error.message
            });
        }
    }
}

export default new transactionController();
