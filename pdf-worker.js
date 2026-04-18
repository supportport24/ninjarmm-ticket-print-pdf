window.onload = function() {
    // Wait for the library to be ready
    function startPDF() {
        if (typeof html2pdf === 'undefined') {
            setTimeout(startPDF, 100);
            return;
        }
        
        const element = document.body;
        const ticketId = document.title.replace('Ticket ', '');
        
        const opt = {
            margin: 10,
            filename: `Ticket_${ticketId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            setTimeout(() => window.close(), 1500);
        });
    }
    startPDF();
};