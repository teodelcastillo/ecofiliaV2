import {
    FileText,
    FileImage,
    FileSpreadsheet,
    FileCode,
    FileArchive,
    FileAudio,
    FileVideo,
    FilePieChart,
    File,
  } from "lucide-react"
  
  export function getFileIcon(fileType?: string) {
    if (!fileType) return File
  
    const type = fileType.toLowerCase()
  
    // Document types
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(type)) {
      return FileText
    }
  
    // Image types
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(type)) {
      return FileImage
    }
  
    // Spreadsheet types
    if (["xls", "xlsx", "csv"].includes(type)) {
      return FileSpreadsheet
    }
  
    // Presentation types
    if (["ppt", "pptx"].includes(type)) {
      return FilePieChart
    }
  
    // Code types
    if (["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(type)) {
      return FileCode
    }
  
    // Archive types
    if (["zip", "rar", "7z", "tar", "gz"].includes(type)) {
      return FileArchive
    }
  
    // Audio types
    if (["mp3", "wav", "ogg", "flac"].includes(type)) {
      return FileAudio
    }
  
    // Video types
    if (["mp4", "webm", "avi", "mov"].includes(type)) {
      return FileVideo
    }
  
    // Default
    return File
  }
  
  