import RequestValidator from "../config/validator.js";
import { render } from "../config/view.js";
import { storeTransactionValidate } from "../validations/transaction.validation.js";
import prisma from "../../prisma/client.js";

class transactionController {
    async index(req, res) {
        return render('transaction/index', {}, req, res);
    }

    async create(req, res) {
        return render('transaction/create', {}, req, res);
    }

    async store(req, res) {
        try {
            const errors = await RequestValidator.validate(req, storeTransactionValidate.rules());

            if (errors) {
                return res.status(422).json({
                    errors
                });
            }

            const { transactionDate, description, amount, type } = req.body;
            const userId = req.session.user.id;

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
                redirect: '/dashboard',
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
