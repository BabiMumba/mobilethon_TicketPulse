import { QRCodeSVG } from 'qrcode.react'
import type { Ticket } from '../data/types'

/**
 * High-fidelity, scannable QR code for a ticket. The encoded payload is a
 * verifiable JSON blob (ticket id, event, status) that a gate scanner app can
 * validate. Rendered as SVG so it stays crisp at any size and works offline.
 */
export default function TicketQR({ ticket, size = 176 }: { ticket: Ticket; size?: number }) {
  const payload = JSON.stringify({
    v: 1,
    id: ticket.id,
    code: ticket.code,
    event: ticket.eventId,
    status: ticket.status,
  })

  return (
    <div className="inline-flex flex-col items-center rounded-2xl bg-white p-3">
      <QRCodeSVG
        value={payload}
        size={size}
        level="M"
        marginSize={0}
        bgColor="#ffffff"
        fgColor="#020617"
      />
    </div>
  )
}
