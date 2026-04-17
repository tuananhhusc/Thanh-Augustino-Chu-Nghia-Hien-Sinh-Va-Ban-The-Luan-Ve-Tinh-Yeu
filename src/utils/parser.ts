import fs from 'fs';
import path from 'path';

export type TextBlock = {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'p' | 'table1' | 'table2' | 'references';
  content: string;
  tableData?: string[][]; 
  references?: { id: string; text: string }[];
};

export function parseArticle(): TextBlock[] {
  const filePath = path.join(process.cwd(), 'src/content/thanhaugustino.txt');
  const rawText = fs.readFileSync(filePath, 'utf-8');
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  const blocks: TextBlock[] = [];
  let isReferences = false;
  let refList: { id: string; text: string }[] = [];

  const h2Matches = [
    "Lời mở đầu",
    "Bản thể luận Phân cực",
    "Bảng Phân Tích Hiện Tượng Học",
    "Ordo Amoris",
    "Hiện tượng học về Nỗi lo âu",
    "Cuộc Đối thoại Trí thức",
    "Phản biện Vô thần",
    "Hannah Arendt và Việc Tái cấu trúc",
    "Tính Ứng dụng Hiện đại",
    "Bảng Tóm tắt Cấu trúc",
    "Tổng kết Lịch sử"
  ];
  
  const h3Matches = [
    "Khát vọng Chiếm hữu",
    "Sự Quy thuận và Tính Hiệp",
    "\"Cor Inquietum\"",
    "Tính Vô lý của Tội",
    "Nỗi Đau Hư vô",
    "Biến đổi Tình yêu Bản thân",
    "Chủ thể tính",
    "Tồn tại Tự tại",
    "Sự Thất bại Tất yếu",
    "Nghịch lý Khách thể",
    "Sự Nghi ngờ Triền miên",
    "Sự Xuất hiện của Bên thứ ba",
    "Điểm Giao thoa",
    "Tự do, Ân sủng",
    "Amor qua appetitus",
    "Creator - Creatura",
    "Dilectio proximi",
    "Lạm dụng và Tái định hình"
  ];

  let i = 0;
  let blockCounter = 0;
  while (i < lines.length) {
    const line = lines[i];
    const blockId = `block-${blockCounter++}`;

    if (i === 0) {
      blocks.push({ id: blockId, type: 'h1', content: line });
      i++;
      continue;
    }

    if (line.startsWith("Nguồn trích dẫn")) {
      isReferences = true;
      blocks.push({ id: blockId, type: 'h2', content: line });
      i++;
      continue;
    }

    if (isReferences) {
      const refMatch = line.match(/^(\d+):?\s*(.*)/);
      if (refMatch) {
         refList.push({ id: refMatch[1], text: refMatch[2] });
      } else {
         refList.push({ id: String(refList.length + 1), text: line });
      }
      i++;
      continue;
    }

    if (line === "Thuộc tính Phân tích") {
      const tableData = [];
      tableData.push([lines[i], lines[i+1], lines[i+2]]);
      i += 3;
      for(let r = 0; r < 5; r++) {
         tableData.push([lines[i], lines[i+1], lines[i+2]]);
         i += 3;
      }
      blocks.push({ id: blockId, type: 'table1', content: '', tableData });
      continue;
    }

    if (line === "Cấp độ") {
      const tableData = [];
      tableData.push([lines[i], lines[i+1], lines[i+2], lines[i+3]]);
      i += 4;
      for(let r = 0; r < 4; r++) {
         tableData.push([lines[i], lines[i+1], lines[i+2], lines[i+3]]);
         i += 4;
      }
      blocks.push({ id: blockId, type: 'table2', content: '', tableData });
      continue;
    }

    // Strict Header Matching
    let isH2 = h2Matches.some(m => line === m || (line.startsWith(m) && line.length < 100));
    let isH3 = h3Matches.some(m => line === m || (line.startsWith(m) && line.length < 80));

    if (isH2) {
      blocks.push({ id: blockId, type: 'h2', content: line });
    } else if (isH3) {
      blocks.push({ id: blockId, type: 'h3', content: line });
    } else {
      blocks.push({ id: blockId, type: 'p', content: line });
    }
    i++;
  }

  if (refList.length > 0) {
     blocks.push({ id: 'references-list', type: 'references', content: '', references: refList });
  }

  return blocks;
}
