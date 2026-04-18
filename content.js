function getTicketData() {
    const ticketId = document.querySelector('li.last-link')?.innerText || "N/A";
    const subject = document.querySelector('h1[data-testid="styled-text-div"] span')?.innerText || "No Subject";
    
    let organization = "N/A";
    document.querySelectorAll('.css-iitc3n').forEach(div => {
        const icon = div.querySelector('svg');
        const text = div.querySelector('p[data-testid="styled-text-div"] span')?.innerText;
        if (icon?.getAttribute('data-icon') === 'sitemap') organization = text;
    });

    let activityHtml = "";
    let totalMinutesAccumulated = 0;
    const entries = document.querySelectorAll('div.css-qeqv5v');
    
    entries.forEach(entry => {
        const user = entry.querySelector('.css-1mjzirv div')?.innerText || "Unknown";
        const date = entry.querySelector('.css-12en0yl div')?.innerText || "";
        const timeText = entry.querySelector('.css-58zd5v p')?.innerText || "0 hours and 0 minutes";
        const comment = entry.querySelector('.css-9x6caq')?.innerText || "";

        const hMatch = timeText.match(/(\d+)\s*hour/);
        const mMatch = timeText.match(/(\d+)\s*minute/);
        totalMinutesAccumulated += ((hMatch ? parseInt(hMatch[1]) : 0) * 60) + (mMatch ? parseInt(mMatch[1]) : 0);

        activityHtml += `
            <div style="margin-bottom: 20px; border-left: 3px solid #004a99; padding-left: 15px; page-break-inside: avoid;">
                <div style="font-size: 12px; color: #555; margin-bottom: 5px; background: #f0f4f8; padding: 4px 8px; border-radius: 4px;">
                    <strong>${user}</strong> | ${date} | <span style="font-weight: bold; color: #004a99;">${timeText}</span>
                </div>
                <div style="font-size: 14px; white-space: pre-wrap;">${comment}</div>
            </div>`;
    });

    const hours = Math.floor(totalMinutesAccumulated / 60);
    const mins = totalMinutesAccumulated % 60;
    const totalTimeDisplay = hours + "h " + mins + "m";

    const contentHtml = `
        <div id="pdf-container" style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <div style="border-bottom: 3px solid #004a99; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
                <h1 style="margin: 0; color: #004a99; font-size: 22px;">${subject}</h1>
                <div style="font-size: 16px; font-weight: bold; color: #666;">Ticket ${ticketId}</div>
            </div>
            <div style="display: flex; gap: 20px; margin-bottom: 30px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <div style="flex: 1;"><label style="display: block; font-size: 10px; color: #888; font-weight: bold; text-transform: uppercase;">Organization</label><span style="font-size: 15px; font-weight: 600;">${organization}</span></div>
                <div style="flex: 1;"><label style="display: block; font-size: 10px; color: #888; font-weight: bold; text-transform: uppercase;">Total Time</label><span style="font-size: 15px; font-weight: 600; color: #004a99;">${totalTimeDisplay}</span></div>
            </div>
            <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Activity Log</h2>
            ${activityHtml}
        </div>
    `;

    return { ticketId, contentHtml };
}

function printTicket() {
    const data = getTicketData();
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Ticket ' + data.ticketId + '</title></head><body>' + data.contentHtml + '</body></html>');
    printWindow.document.close();
    setTimeout(() => { 
        if (printWindow) {
            printWindow.print(); 
            printWindow.close(); 
        }
    }, 800);
}

function generatePDF() {
    const data = getTicketData();
    const pdfWindow = window.open('', '_blank');
    
    const libUrl = chrome.runtime.getURL('html2pdf.bundle.min.js');
    const workerUrl = chrome.runtime.getURL('pdf-worker.js');
    
    pdfWindow.document.write(`
        <html>
            <head>
                <title>Ticket ${data.ticketId}</title>
                <script src="${libUrl}"></script>
                <script src="${workerUrl}"></script>
            </head>
            <body>
                <div id="pdf-wrapper">${data.contentHtml}</div>
            </body>
        </html>
    `);
    pdfWindow.document.close();
}

function injectButton() {
    const isTicketingPage = window.location.href.includes('/ticketing/ticket/');
    const existingPrint = document.getElementById('ninja-print-btn');

    if (!isTicketingPage) {
        if (existingPrint) {
            existingPrint.remove();
            document.getElementById('ninja-pdf-btn')?.remove();
        }
        return;
    }

    if (existingPrint) return;

    const actionContainer = document.querySelector('.css-lr745z'); 
    if (actionContainer) {
        const printBtn = document.createElement('button');
        printBtn.id = 'ninja-print-btn';
        printBtn.innerHTML = 'Print';
        printBtn.style = 'margin-right: 8px; padding: 4px 12px; background: #004a99; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600;';
        printBtn.addEventListener('click', printTicket);

        const pdfBtn = document.createElement('button');
        pdfBtn.id = 'ninja-pdf-btn';
        pdfBtn.innerHTML = 'PDF';
        pdfBtn.style = 'margin-right: 8px; padding: 4px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600;';
        pdfBtn.addEventListener('click', generatePDF);

        actionContainer.prepend(pdfBtn);
        actionContainer.prepend(printBtn);
    }
}

const observer = new MutationObserver(injectButton);
observer.observe(document.body, { childList: true, subtree: true });
