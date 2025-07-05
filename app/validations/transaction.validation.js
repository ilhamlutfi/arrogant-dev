import { body } from 'express-validator';

const storeTransactionValidate = {
    rules: () => [
        body('transactionDate')
            .notEmpty().withMessage('Tanggal transaksi harus diisi'),
        body('description')
            .notEmpty().withMessage('Deskripsi harus diisi'),
        body('amount')
            .notEmpty().withMessage('Jumlah harus diisi')
            .isNumeric().withMessage('Jumlah harus berupa angka'),
        body('type')
            .notEmpty().withMessage('Type harus diisi')
            .isIn(['income', 'expense']).withMessage('Type harus pemasukan atau pengeluaran'),
    ]
}

export {
    storeTransactionValidate
}
