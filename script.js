document.addEventListener("DOMContentLoaded", function() {
    // Menyimpan data calon debitur di localStorage
    let debtors = JSON.parse(localStorage.getItem('debtors')) || [];

    // Fungsi untuk menunjukkan halaman tertentu
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.style.display = 'block';
    } else {
        console.error(`Halaman dengan ID ${pageId} tidak ditemukan`);
    }
}

// Fungsi login untuk Sales dengan sistem restricted access
function salesLogin() {
    const salesName = document.getElementById('salesName').value;
    const salesPassword = document.getElementById('salesPassword').value;

    // Cek kredensial
    if (salesName === 'admin' && salesPassword === 'kramat') {
        showPage('salesDashboard');
    } else {
        alert('Nama atau kata sandi salah, silakan coba lagi.');
    }
}

    // Fungsi untuk analisis kredit
    function analyzeCredit() {
    // Periksa apakah checkbox disetujui
    const termsAccepted = document.getElementById('terms').checked;
    if (!termsAccepted) {
        alert('Harap setujui ketentuan yang berlaku sebelum melanjutkan.');
        return;
    }
        // Ambil nilai formulir
        const Nama = document.getElementById('Nama').value;
	const Telepon = document.getElementById('Telepon').value;
        const Pendapatan = parseFloat(document.getElementById('Pendapatan').value);
        const CicilanBerjalan = parseFloat(document.getElementById('CicilanBerjalan').value);
        const LamaBekerja = parseInt(document.getElementById('LamaBekerja').value);
        const Kepegawaian = document.getElementById('Kepegawaian').value;
        const Instansi = document.getElementById('Instansi').value;
	const Branch = document.getElementById('Branch').value;


        // Ambil nilai cicilan baru dari localStorage
        const newInstallment = parseFloat(localStorage.getItem('newInstallment')) || 0;

        // Hitung cicilan total
        const CicilanTotal = CicilanBerjalan + newInstallment;

        // Logika analisis kredit dasar
        let analysis = '';
        let approval = '';

        // Hitung rasio pendapatan terhadap cicilan
        const incomeLoanRatio = (CicilanTotal / Pendapatan).toFixed(2);

        // Tentukan apakah durasi kerja memenuhi persyaratan
        let workingDurationOK = false;
        if (Kepegawaian === 'Tetap') {
            if (Instansi === 'Pemerintah' || Instansi === 'BUMN') {
                workingDurationOK = LamaBekerja >= 1;
            } else if (Instansi === 'Swasta') {
                workingDurationOK = LamaBekerja >= 2;
            }
        }

        // Tentukan hasil analisis
        if (workingDurationOK && incomeLoanRatio <= 0.6) {
            analysis = `Selamat ${Nama}, rasio cicilan total Anda baik, data tersimpan.`;
            approval = 'persyaratan terpenuhi,segera diproses';
        } else if (workingDurationOK && incomeLoanRatio > 0.6) {
            analysis = `Hi ${Nama}, rasio cicilan total Anda terlalu tinggi,silahkan konsultasi dengan sales kami.`;
            approval = 'pinjaman anda terlalu tinggi(DSR>0.6).';
        } else {
            analysis = `Maaf ${Nama}, pengajuan Anda tidak sesuai kriteria kami, silahkan konsultasi dengan sales kami.`;
            approval = 'status pekerjaan/durasi/instansi pekerjaan tidak sesuai';
        }

// Ambil nama sales dan nomor WA dari opsi cabang
    const branchSelect = document.getElementById('Branch');
    const selectedOption = branchSelect.options[branchSelect.selectedIndex];
    const salesName = selectedOption.getAttribute('data-sales-name');
    const salesWA = selectedOption.getAttribute('data-sales-wa');

        // Simpan data calon debitur
        const debtor = {
            Nama,
	    Telepon,
	    Branch,
            Pendapatan,
            CicilanBerjalan,
            LamaBekerja,
            Kepegawaian,
            Instansi,
            CicilanTotal,
            incomeLoanRatio,
            status: approval
        };
        debtors.push(debtor);
        localStorage.setItem('debtors', JSON.stringify(debtors));

// Tampilkan hasil analisis dalam popup
    alert(`Analysis Result:\n${analysis}\n${approval}\n\nSales Name: ${salesName}\nSales WA: ${salesWA}`);


        // Reset form
        document.getElementById('creditForm').reset();
    }

    // Fungsi untuk menghitung cicilan
    function calculateInstallment() {
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const loanPeriod = parseFloat(document.getElementById('loan-period').value);

        if (loanAmount && loanPeriod) {
            const annualInterestRate = 0.12;
            const monthlyInterestRate = annualInterestRate / 12;
            const numberOfPayments = loanPeriod * 12;

            const installment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
            const formattedInstallment = installment.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

            // Simpan nilai cicilan baru di localStorage
            localStorage.setItem('newInstallment', installment.toFixed(2));

            document.getElementById('installmentResult').innerHTML = `Cicilan per bulan: ${formattedInstallment}`;
        } else {
            alert('Harap masukkan nilai pinjaman dan periode pinjaman.');
        }
    }

   // Fungsi untuk memuat daftar calon debitur di dashboard sales
function loadDebtorList() {
    const debtorList = document.getElementById('debtorList');
    debtorList.innerHTML = '<h2>Daftar Calon Debitur</h2>';
    debtors.forEach((debtor, index) => {
        const debtorItem = document.createElement('div');
        debtorItem.className = 'debtor-item';
        debtorItem.innerHTML = `
            <p><strong>Nama:</strong> ${debtor.Nama}</p>
            <p><strong>Telepon:</strong> ${debtor.Telepon || 'Data tidak tersedia'}</p>
            <p>KC Kelolaan: ${debtor.Branch || 'Data tidak tersedia'}</p>
            <p>Pendapatan: ${debtor.Pendapatan}</p>
            <p>Kepegawaian: ${debtor.Kepegawaian}</p>
            <p>Instansi: ${debtor.Instansi}</p>
            <p>Lama Bekerja: ${debtor.LamaBekerja}</p>
            <p>Cicilan Berjalan: ${debtor.CicilanBerjalan}</p>
            <p>Cicilan Total: ${debtor.CicilanTotal}</p>
            <p>Rasio Pendapatan terhadap Cicilan: ${debtor.incomeLoanRatio}</p>
            <p>Status: ${debtor.status}</p>
            <button onclick="alert('File berhasil di-download!')">Download Berkas</button>
            <button onclick="deleteDebtor(${index})">Hapus</button>
        `;
        debtorList.appendChild(debtorItem);
    });
}

    // Fungsi untuk menghapus data calon debitur
    function deleteDebtor(index) {
        debtors.splice(index, 1);
        localStorage.setItem('debtors', JSON.stringify(debtors));
        loadDebtorList();
    }

    // Fungsi untuk menghapus semua data calon debitur
    function clearDebtors() {
        localStorage.removeItem('debtors');
        debtors = [];
        loadDebtorList();
    }

    // Muat daftar calon debitur saat halaman dimuat
    loadDebtorList();

    // Attach functions to window for access from HTML
    window.clearDebtors = clearDebtors;
    window.deleteDebtor = deleteDebtor;
    window.analyzeCredit = analyzeCredit;
    window.showPage = showPage;
    window.calculateInstallment = calculateInstallment;
window.salesLogin = salesLogin; // Attach the new login function

// Initially show the login page
    // Initially show the login page
    showPage('login');
});
