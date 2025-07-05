import { validationResult } from 'express-validator';

const RequestValidator = {
    async validate(req, rules) {
        await Promise.all(rules.map(rule => rule.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errors.mapped(); // ⬅️ Ubah dari array() jadi mapped()
        }

        return null;
    }
    
    // async validateApi(req, res, rules) {
    //     await Promise.all(rules.map(rule => rule.run(req)));

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(422).json({
    //             status: 'validation_failed',
    //             message: 'Please check your input',
    //             errors: errors.array()
    //         });
    //     }
    // },

    // // helper khusus render ke view jika kamu ingin ringkas
    // async validateAndRender(req, rules, res, view) {
    //     const errors = await this.validate(req, rules);
    //     if (errors) {
    //         return res.status(422).render(view, {
    //             errors,
    //             old: req.body
    //         });
    //     }

    //     return null;
    // }
};

export default RequestValidator;
