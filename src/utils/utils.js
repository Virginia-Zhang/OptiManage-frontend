import { ElMessage } from "element-plus"

// Message pop-up window
export const messageTip = (type, content) => {
  return ElMessage({
    type,
    message: content,
    duration: 2000,
    center: true,
    showClose: true
  })
}