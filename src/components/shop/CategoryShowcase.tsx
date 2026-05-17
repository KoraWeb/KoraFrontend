import Image from "next/image";
import Link from "next/link";

type CategoryCard = {
    title: string;
    href: string;
    image: string;
    label?: string;
};

type CategoryShowcaseProps = {
    eyebrow?: string;
    title: string;
    viewAllHref?: string;
    viewAllText?: string;
    cards: CategoryCard[];
};

export default function CategoryShowcase({
    eyebrow = "Shop by style",
    title,
    viewAllHref,
    viewAllText = "Ver todo",
    cards,
}: CategoryShowcaseProps) {
    return (
        <div className="px-6 py-20 md:px-12 lg:px-16">
            <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                    <h2 className="mt-4 text-black text-4xl font-black uppercase leading-none tracking-tight md:text-5xl lg:text-6xl">
                        {title}
                    </h2>
                </div>

                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className="hidden text-sm font-bold underline underline-offset-4 transition hover:text-neutral-500 md:block"
                    >
                        {viewAllText}
                    </Link>
                )}
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="group relative h-[430px] overflow-hidden bg-neutral-200 md:h-[480px]"
                    >
                        <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/35" />

                        <div className="absolute bottom-7 left-7 text-white">
                            <h3 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
                                {card.title}
                            </h3>

                            <p className="mt-3 w-fit text-sm font-medium underline underline-offset-4">
                                {card.label || "Comprar"}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className="mt-8 block text-sm font-bold underline underline-offset-4 md:hidden"
                >
                    {viewAllText}
                </Link>
            )}
        </div>
    );
}