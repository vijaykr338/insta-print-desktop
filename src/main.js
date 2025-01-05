import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { download } from 'electron-dl';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib'; // Import pdf-lib

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('print-file', async (event, filePath) => {
  if (!fs.existsSync(filePath)) {
    return { success: false, error: 'File does not exist' };
  }

  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const printWindow = new BrowserWindow({
      show: true, // Make the window visible
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    });

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    const htmlContent = `<embed src="${pdfDataUri}" type="application/pdf" width="100%" height="100%">`;

    printWindow.loadURL(`data:text/html;base64,${Buffer.from(htmlContent).toString('base64')}`);

    // Ensure the content is fully loaded before printing
    printWindow.webContents.on('did-finish-load', async () => {
      try {
        const pdfData = await printWindow.webContents.printToPDF({});
        fs.writeFileSync(filePath, pdfData);
        printWindow.webContents.print({ silent: false, printBackground: true }, (success, errorType) => {
          if (!success) {
            console.error(`Print failed: ${errorType}`);
          }
          printWindow.close(); // Close the window after printing
        });
      } catch (error) {
        console.error(`Failed to generate PDF: ${error.message}`);
        printWindow.close();
      }
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('download-file', async (event, { url }) => {
  try {
    const downloadItem = await download(BrowserWindow.getFocusedWindow(), url, {
      onProgress: (progress) => console.log(`Progress: ${progress.percent * 100}%`),
    });

    const fileDetails = {
      fileName: downloadItem.getFilename(),
      filePath: downloadItem.getSavePath(),
      fileSize: downloadItem.getTotalBytes(),
    };

    return { success: true, fileDetails };
  } catch (error) {
    return { success: false, error: error.message };
  }
});