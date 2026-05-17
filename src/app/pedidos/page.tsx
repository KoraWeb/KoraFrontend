"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Order } from "@/api/order/route";
import KoraIcon from "@/components/Icons/KoraIcon";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Realizado",
  SHIPPED: "Enviado",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  SHIPPED: "bg-blue-50 text-blue-600 border-blue-200",
  IN_TRANSIT: "bg-purple-50 text-purple-600 border-purple-200",
  DELIVERED: "bg-green-50 text-green-600 border-green-200",
};

const STATUS_DOT: Record<string, string> = {
  PENDING: "bg-amber-400",
  SHIPPED: "bg-blue-400",
  IN_TRANSIT: "bg-purple-400",
  DELIVERED: "bg-green-400",
};

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type GroupedByMonth = {
  monthIndex: number;
  monthName: string;
  days: {
    day: number;
    dayName: string;
    orders: Order[];
  }[];
};

function groupOrders(orders: Order[]): GroupedByMonth[] {
  const byMonth: Record<number, Record<number, Order[]>> = {};
  orders.forEach((order) => {
    const d = new Date(order.date);
    const m = d.getMonth();
    const day = d.getDate();
    if (!byMonth[m]) byMonth[m] = {};
    if (!byMonth[m][day]) byMonth[m][day] = [];
    byMonth[m][day].push(order);
  });

  return Object.entries(byMonth)
    .sort(([a], [b]) => Number(b) - Number(a)) // meses descendente
    .map(([monthIdx, days]) => ({
      monthIndex: Number(monthIdx),
      monthName: MONTH_NAMES[Number(monthIdx)],
      days: Object.entries(days)
        .sort(([a], [b]) => Number(b) - Number(a)) // días descendente
        .map(([day, orders]) => {
          const firstDate = new Date(orders[0].date);
          const dayName = firstDate.toLocaleDateString("es-ES", { weekday: "long" });
          return { day: Number(day), dayName, orders };
        }),
    }));
}

export default function PedidosPage() {
  const { logged, loading, token } = useAuth();
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !logged) router.push("/auth");
  }, [loading, logged, router]);

  useEffect(() => {
    if (!logged) return;
    setOrdersLoading(true);
    fetch("/api/orders")
      .then(r => r.json())
      .then(setAllOrders)
      .catch(() => setAllOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [logged]);

  // Años disponibles de los pedidos
  const availableYears = useMemo(() => {
    const years = new Set(allOrders.map((o) => new Date(o.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [allOrders]);

  // Pedidos del año seleccionado
  const ordersInYear = useMemo(() =>
    allOrders.filter((o) => new Date(o.date).getFullYear() === selectedYear),
    [allOrders, selectedYear]
  );

  // Meses con pedidos en ese año
  const availableMonths = useMemo(() => {
    const months = new Set(ordersInYear.map((o) => new Date(o.date).getMonth()));
    return Array.from(months).sort((a, b) => b - a);
  }, [ordersInYear]);

  // Pedidos filtrados por mes (si hay seleccionado)
  const filteredOrders = useMemo(() => {
    if (selectedMonth === null) return ordersInYear;
    return ordersInYear.filter((o) => new Date(o.date).getMonth() === selectedMonth);
  }, [ordersInYear, selectedMonth]);

  const grouped = useMemo(() => groupOrders(filteredOrders), [filteredOrders]);

  if (loading || ordersLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-10 h-10 border-2 border-[#CDB4DB] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* HEADER */}
      <div className="w-full bg-white border-b border-gray-200 px-6 md:px-16 py-6">
        <button onClick={() => router.push("/profile")} className="text-xs text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition-colors">
          ← Volver al perfil
        </button>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black">Historial de pedidos</h1>
            <p className="text-sm text-gray-400 mt-0.5">{allOrders.length} pedido{allOrders.length !== 1 ? "s" : ""} en total</p>
          </div>

          {/* FILTRO POR AÑO */}
          {availableYears.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Año</span>
              <div className="flex gap-1.5 flex-wrap">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setSelectedMonth(null); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors border ${
                      selectedYear === year
                        ? "bg-[#CDB4DB] text-white border-[#CDB4DB]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-[#CDB4DB] hover:text-[#CDB4DB]"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FILTRO POR MES */}
        {availableMonths.length > 1 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Mes</span>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedMonth(null)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                  selectedMonth === null
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                Todos
              </button>
              {availableMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                    selectedMonth === m
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {MONTH_NAMES[m]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-10 py-10">
        {allOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 opacity-20"><KoraIcon className="w-full h-full" /></div>
            <p className="text-sm text-gray-400 tracking-wide">Todavía no tienes ningún pedido</p>
            <button onClick={() => router.push("/search")} className="mt-2 px-6 py-2 bg-[#CDB4DB] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#a66fc6] transition-colors rounded">
              Explorar tienda
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-gray-400">No hay pedidos en {selectedMonth !== null ? `${MONTH_NAMES[selectedMonth]} de ` : ""}{selectedYear}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {grouped.map(({ monthIndex, monthName, days }) => (
              <div key={monthIndex}>
                {/* CABECERA MES */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#CDB4DB] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{monthIndex + 1}</span>
                    </div>
                    <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-600">{monthName} {selectedYear}</h2>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">
                    {days.reduce((acc, d) => acc + d.orders.length, 0)} pedido{days.reduce((acc, d) => acc + d.orders.length, 0) !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* DÍAS */}
                <div className="flex flex-col gap-6">
                  {days.map(({ day, dayName, orders: dayOrders }) => (
                    <div key={day}>
                      {/* Etiqueta del día */}
                      <div className="flex items-center gap-2 mb-3 ml-1">
                        <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase capitalize">{dayName} {day}</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>

                      {/* Pedidos del día */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {dayOrders.map((order) => {
                          const orderDate = new Date(order.date);
                          return (
                            <button
                              key={order.id}
                              onClick={() => router.push(`/pedidos/${order.id}`)}
                              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#CDB4DB] hover:shadow-md transition-all duration-200 text-left flex flex-col gap-3"
                            >
                              <div className="flex items-start gap-3">
                                {/* Imágenes apiladas de los productos */}
                                <div className="relative shrink-0 w-14 h-14">
                                  {order.items && order.items.length > 0 ? (
                                    <>
                                      {order.items.slice(0, 3).map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="absolute rounded-lg bg-[#f0eaf5] overflow-hidden border-2 border-white"
                                          style={{
                                            width: 44,
                                            height: 44,
                                            top: idx * 5,
                                            left: idx * 5,
                                            zIndex: order.items!.length - idx,
                                          }}
                                        >
                                          {item.productImage
                                            ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-contain p-1" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                            : <div className="w-full h-full flex items-center justify-center"><KoraIcon className="w-5 h-5 opacity-20" /></div>
                                          }
                                        </div>
                                      ))}
                                      {order.items.length > 3 && (
                                        <div className="absolute rounded-lg bg-black/80 flex items-center justify-center border-2 border-white" style={{ width: 44, height: 44, top: 15, left: 15, zIndex: 0 }}>
                                          <span className="text-white text-[10px] font-bold">+{order.items.length - 3}</span>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="w-14 h-14 rounded-lg bg-[#f0eaf5] flex items-center justify-center">
                                      <KoraIcon className="w-6 h-6 opacity-20" />
                                    </div>
                                  )}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-base font-bold text-black">#{order.id}</p>
                                    <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLOR[order.status]}`}>
                                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle ${STATUS_DOT[order.status]}`} />
                                      {STATUS_LABEL[order.status]}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {orderDate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} · {order.items?.length ?? 0} artículo{(order.items?.length ?? 0) !== 1 ? "s" : ""}
                                  </p>
                                  {/* Nombres de productos */}
                                  {order.items && order.items.length > 0 && (
                                    <p className="text-[10px] text-gray-400 mt-1 truncate">
                                      {order.items.map(i => i.productName).join(", ")}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Barra de progreso de estado */}
                              <div className="flex gap-1">
                                {["PENDING","SHIPPED","IN_TRANSIT","DELIVERED"].map((s, i) => {
                                  const idx = ["PENDING","SHIPPED","IN_TRANSIT","DELIVERED"].indexOf(order.status);
                                  return (
                                    <div key={s} className={`h-1 flex-1 rounded-full transition-all ${i <= idx ? "bg-[#CDB4DB]" : "bg-gray-100"}`} />
                                  );
                                })}
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                                    {["Realizado","Enviado","En camino","Entregado"][["PENDING","SHIPPED","IN_TRANSIT","DELIVERED"].indexOf(order.status)]}
                                  </p>
                                </div>
                                <span className="text-lg font-bold text-[#124880]">{order.total.toFixed(2)} €</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}