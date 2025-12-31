import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {useRef} from "react";

const MathAndImageToPdf = () => {
  const mathRef = useRef<HTMLDivElement>(null);

  const downloadPdf = async () => {
    if (!mathRef.current) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Render MathML section
    const canvas = await html2canvas(mathRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

    let currentY = 10 + pdfHeight + 10;

    // Load and add external image
    const externalImgUrl =
      "https://e8y1.c12.e2-4.dev/p2tsgp/p2t/Uploads/98/mcq_image/12-05-2025/062e33e24f5b43f8ba2ccf2c4c576867.png";
    const externalImage = await loadImageAsBase64(externalImgUrl);

    const extImgProps = doc.getImageProperties(externalImage);
    const extImgHeight = (extImgProps.height * pdfWidth) / extImgProps.width;

    // Add external image
    doc.addImage(externalImage, "PNG", 10, currentY, pdfWidth, extImgHeight);

    doc.save("math-and-image.pdf");
  };

  const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  return (
    <div>
      <div ref={mathRef} style={{padding: 10, background: "#fff"}}>
      </div>

      <button onClick={downloadPdf} style={{marginTop: 20}}>
        Download PDF with MathML + Image
      </button>
    </div>
  );
};

export default MathAndImageToPdf;
