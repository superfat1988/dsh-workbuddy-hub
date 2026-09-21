// Minimal ZIP reader (store + deflate), enough for the official skill packages
// (each contains <name>/SKILL.md). No external dependency.
import { inflateRawSync } from 'node:zlib'

export function unzip(buf) {
  const files = []
  let off = 0
  while (off + 4 <= buf.length) {
    if (buf.readUInt32LE(off) !== 0x04034b50) break
    const method = buf.readUInt16LE(off + 8)
    const compressedSize = buf.readUInt32LE(off + 18)
    const nameLen = buf.readUInt16LE(off + 26)
    const extraLen = buf.readUInt16LE(off + 28)
    const name = buf.slice(off + 30, off + 30 + nameLen).toString('utf8')
    const dataStart = off + 30 + nameLen + extraLen
    const data = buf.slice(dataStart, dataStart + compressedSize)
    if (method === 0) files.push({ name, data })
    else if (method === 8) {
      try { files.push({ name, data: inflateRawSync(data) }) } catch { /* skip */ }
    }
    off = dataStart + compressedSize
    // data descriptor (bit 3) follows with crc/size — the local header above
    // already carries the size for streamed zips written by common tools.
  }
  return files
}
