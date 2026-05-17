"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Order } from "@/api/order/route";
import KoraIcon from "@/components/Icons/KoraIcon";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Realizado", SHIPPED: "Enviado", IN_TRANSIT: "En camino", DELIVERED: "Entregado",
};
const STATUS_STEPS = ["PENDING", "SHIPPED", "IN_TRANSIT", "DELIVERED"];

function getExpectedDelivery(order: Order): string {
  const d = new Date(order.date);
  d.setDate(d.getDate() + (order.deliveryDays ?? 7));
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}

export default function OrderDetailPage() {
  const { logged, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!loading && !logged) router.push("/auth");
  }, [loading, logged, router]);

  useEffect(() => {
    if (loading) return;
    if (!logged) return;
    setOrderLoading(true);
    fetch(`/api/orders/${orderId}`)
      .then(r => r.json())
      .then(data => setOrder({ ...data, total: data.total ?? 0, items: data.items ?? [] }))
      .catch(() => router.push("/pedidos"))
      .finally(() => setOrderLoading(false));
  }, [loading, logged, orderId]);

  if (loading || orderLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-10 h-10 border-2 border-[#CDB4DB] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return null;

  const stepIndex = STATUS_STEPS.indexOf(order.status);
  const date = new Date(order.date);
  const expectedDelivery = getExpectedDelivery(order);
  const invoiceNum = `KOR-${String(order.id).padStart(6, "0")}`;
  const total = order.total ?? 0;
  const subtotal = total / 1.21;
  const iva = total - subtotal;
  const items = order.items ?? [];
  const clientName = order.userName || "";
  const clientEmail = order.userEmail || "";
  const clientAddress = order.userAddress || "";

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      // Crear elemento HTML oculto con la factura
      const invoiceEl = document.createElement("div");
      invoiceEl.style.cssText = "position:fixed;left:-9999px;top:0;width:1200px;background:#fff;";
      invoiceEl.innerHTML = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;color:#111;background:#fff;padding:60px 70px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;padding-bottom:28px;border-bottom:3px solid #111;">
            <div>
              <div style="font-size:38px;font-weight:900;letter-spacing:0.12em;color:#111;text-transform:uppercase;">KORA</div>
              <div style="font-size:11px;color:#CDB4DB;letter-spacing:0.25em;text-transform:uppercase;margin-top:4px;">Fashion Store</div>
              <div style="font-size:12px;color:#888;margin-top:10px;line-height:1.8;">koramailhelp@gmail.com<br/>www.kora.es</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;font-weight:700;color:#CDB4DB;letter-spacing:0.25em;text-transform:uppercase;">Factura</div>
              <div style="font-size:30px;font-weight:900;color:#111;margin-top:4px;">${invoiceNum}</div>
              <div style="font-size:13px;color:#888;margin-top:6px;">${date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })} · ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</div>
              <div style="display:inline-block;margin-top:10px;padding:6px 20px;border-radius:20px;background:#f0eaf5;color:#111;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-align:center;">${STATUS_LABEL[order.status]}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:40px;">
            <div>
              <div style="font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#9c5fb5;margin-bottom:10px;">Datos del cliente</div>
              <div style="background:#f0eaf5;border:1px solid #e0d0eb;border-radius:10px;padding:18px 20px;font-size:14px;line-height:1.9;color:#444;">
                <strong style="color:#111;font-weight:700;">${clientName || "—"}</strong><br/>
                ${clientEmail || "—"}<br/>
                ${clientAddress || "Sin direccion registrada"}
              </div>
            </div>
            <div>
              <div style="font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#9c5fb5;margin-bottom:10px;">Datos del pedido</div>
              <div style="background:#f0eaf5;border:1px solid #e0d0eb;border-radius:10px;padding:18px 20px;font-size:14px;line-height:1.9;color:#444;">
                <strong style="color:#111;">Nº factura:</strong> ${invoiceNum}<br/>
                <strong style="color:#111;">Nº pedido:</strong> #${order.id}<br/>
                <strong style="color:#111;">Fecha:</strong> ${date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}<br/>
                <strong style="color:#111;">Entrega est.:</strong> ${expectedDelivery}
              </div>
            </div>
          </div>

          <div style="font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#9c5fb5;margin-bottom:12px;">Articulos del pedido</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
            <thead>
              <tr style="background:linear-gradient(135deg,#9c5fb5,#CDB4DB);">
                <th style="padding:12px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#fff;">Producto</th>
                <th style="padding:12px 10px;text-align:center;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#fff;">Talla</th>
                <th style="padding:12px 10px;text-align:center;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#fff;">Cant.</th>
                <th style="padding:12px 10px;text-align:right;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#fff;">P. unit.</th>
                <th style="padding:12px 10px;text-align:right;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#fff;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, idx) => `
                <tr style="background:${idx % 2 === 0 ? "#fff" : "#f9f5fc"};">
                  <td style="padding:12px 10px;font-size:14px;border-bottom:1px solid #f0eaf5;"><strong style="color:#111;">${item.productName}</strong></td>
                  <td style="padding:12px 10px;font-size:14px;border-bottom:1px solid #f0eaf5;text-align:center;color:#666;">${item.sizeName}</td>
                  <td style="padding:12px 10px;font-size:14px;border-bottom:1px solid #f0eaf5;text-align:center;color:#666;">${item.quantity}</td>
                  <td style="padding:12px 10px;font-size:14px;border-bottom:1px solid #f0eaf5;text-align:right;color:#111;">${(item.unitPrice ?? 0).toFixed(2)} €</td>
                  <td style="padding:12px 10px;font-size:14px;border-bottom:1px solid #f0eaf5;text-align:right;font-weight:700;color:#111;">${(item.subtotal ?? 0).toFixed(2)} €</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div style="display:flex;justify-content:flex-end;margin:24px 0 40px;">
            <div style="min-width:280px;">
              <div style="display:flex;justify-content:space-between;font-size:14px;padding:6px 0;color:#666;border-bottom:1px solid #f0eaf5;">
                <span>Subtotal (sin IVA)</span><span style="color:#111;font-weight:600;">${subtotal.toFixed(2)} €</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:14px;padding:6px 0;color:#666;border-bottom:1px solid #f0eaf5;">
                <span>IVA (21%)</span><span style="color:#111;font-weight:600;">${iva.toFixed(2)} €</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:14px;padding:6px 0;color:#666;border-bottom:1px solid #f0eaf5;">
                <span>Envio</span><span style="color:#2e7d32;font-weight:700;">Gratis</span>
              </div>
              <div style="background:linear-gradient(135deg,#9c5fb5,#CDB4DB);border-radius:8px;padding:16px 18px;margin-top:14px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.1em;">Total</span>
                <span style="font-size:26px;font-weight:900;color:#fff;">${total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <div style="border-top:2px solid #f0eaf5;padding-top:22px;font-size:12px;color:#CDB4DB;text-align:center;line-height:1.9;">
            KORA Fashion Store · koramailhelp@gmail.com · www.kora.es<br/>
            Factura oficial · ${invoiceNum} · Conserva este documento para tus registros
          </div>
        </div>
      `;

      document.body.appendChild(invoiceEl);

      const canvas = await html2canvas(invoiceEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(invoiceEl);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNum}_factura.pdf`);
    } catch (e) {
      console.error("Error generando PDF:", e);
      alert("Error al generar el PDF. Inténtalo de nuevo.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* HEADER */}
      <div className="w-full bg-white border-b border-gray-200 px-6 md:px-16 py-6 flex items-center justify-between">
        <div>
          <button onClick={() => router.push("/pedidos")} className="text-xs text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1 transition-colors">
            ← Volver a pedidos
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-black">Pedido #{order.id}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {date.toLocaleDateString("es-ES", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {downloading ? "Generando..." : "Descargar factura PDF"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-10 py-10 flex flex-col gap-6">

        {/* ESTADO */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Estado del pedido</h2>
            <span className="text-xs text-gray-400">
              Entrega estimada: <span className="font-semibold text-gray-600">{expectedDelivery}</span>
            </span>
          </div>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= stepIndex ? "bg-[#CDB4DB] text-white" : "bg-gray-100 text-gray-400"}`}>
                    {i < stepIndex ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] font-semibold tracking-wide text-center ${i <= stepIndex ? "text-[#CDB4DB]" : "text-gray-300"}`}>
                    {STATUS_LABEL[step]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-4 mx-1 transition-colors ${i < stepIndex ? "bg-[#CDB4DB]" : "bg-gray-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ARTÍCULOS */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-5">Artículos del pedido</h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">No hay artículos registrados en este pedido.</p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg bg-[#f0eaf5] flex items-center justify-center shrink-0 overflow-hidden">
                    {item.productImage
                      ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-contain p-2" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <div className="w-6 h-6 opacity-20"><KoraIcon className="w-full h-full" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-black truncate">{item.productName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Talla: {item.sizeName}</p>
                    <p className="text-xs text-gray-400">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{(item.unitPrice ?? 0).toFixed(2)} € / ud.</p>
                    <p className="font-bold text-black mt-0.5">{(item.subtotal ?? 0).toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-gray-200 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Subtotal (sin IVA)</span>
              <span className="text-black font-medium">{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>IVA (21%)</span>
              <span className="text-black font-medium">{iva.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Envío</span>
              <span className="text-green-600 font-semibold">Gratis</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-gray-200 mt-1">
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400">Total</span>
              <span className="text-2xl font-bold text-black">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* DATOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Datos de envío</h2>
            <div className="text-sm text-gray-600 flex flex-col gap-1.5">
              <p><span className="font-semibold text-black">Nombre:</span> {clientName || "—"}</p>
              <p><span className="font-semibold text-black">Email:</span> {clientEmail || "—"}</p>
              <p><span className="font-semibold text-black">Dirección:</span> {clientAddress || "—"}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Datos de la factura</h2>
            <div className="text-sm text-gray-600 flex flex-col gap-1.5">
              <p><span className="font-semibold text-black">Nº factura:</span> {invoiceNum}</p>
              <p><span className="font-semibold text-black">Nº pedido:</span> #{order.id}</p>
              <p><span className="font-semibold text-black">Fecha:</span> {date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}</p>
              <p><span className="font-semibold text-black">Entrega est.:</span> {expectedDelivery}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}