const formatRupiah = (angka) => {
    const formatted = Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);

     // Ganti 'Rp' dengan 'Rp.' (pakai regex agar aman)
     return formatted.replace(/^Rp/, 'Rp.');
};

export default formatRupiah;
