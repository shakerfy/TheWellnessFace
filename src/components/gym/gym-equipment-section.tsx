import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getGymEquipment } from "@/lib/gym-equipment";

interface EquipmentSectionProps {
  slug: string;
}

export function GymEquipmentSection({ slug }: EquipmentSectionProps) {
  const equipment = getGymEquipment(slug);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = containerRef.current;
    if (!slider) return;
    isDownRef.current = true;
    slider.style.cursor = "grabbing";
    startXRef.current = e.pageX - slider.offsetLeft;
    scrollLeftRef.current = slider.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
    const slider = containerRef.current;
    if (slider) {
      slider.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
    const slider = containerRef.current;
    if (slider) {
      slider.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current) return;
    const slider = containerRef.current;
    if (!slider) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // speed multiplier
    slider.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <section className="mt-16 border-t border-border pt-16 select-none">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Equipamiento disponible</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Maquinaria, accesorios y herramientas disponibles en este centro.
          </p>
          <p className="mt-1.5 text-[10px] text-muted-foreground/70 italic">
            * Las imágenes son de carácter ilustrativo y representativo del equipamiento del centro.
          </p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipamiento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab" }}
        className="mt-6 flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory min-h-[200px]"
      >
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item, idx) => (
            <div
              key={idx}
              className="w-[240px] sm:w-[260px] shrink-0 snap-start bg-card/25 rounded-3xl p-3 hover:bg-secondary/10 hover:scale-[1.01] transition-all duration-300"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  draggable="false"
                  className="h-full w-full object-cover hover:scale-[1.03] transition duration-500 select-none"
                />
              </div>
              <div className="mt-3 px-1">
                <h3 className="font-semibold text-sm tracking-tight text-foreground">
                  {item.name}
                </h3>
                {item.desc && (
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex w-full items-center justify-center p-8 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-border border-dashed">
            No se encontró equipamiento con ese nombre.
          </div>
        )}
      </div>
    </section>
  );
}
