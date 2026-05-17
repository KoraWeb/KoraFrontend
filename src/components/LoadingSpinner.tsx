import { ClipLoader } from "react-spinners";

//Pagina con un circulo cargando
export default function LoadingSpinner() {
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center`}>
            <ClipLoader size={150} color="#CDB4DB" loading={true}
                cssOverride={{
                    borderWidth: '6px',
                    animation: 'spin 0.5s linear infinite',
                }}
            />
            <p className="text-black font-bold text-xl sm:text-4xl mt-10 font-helvetica">
                Cargando...
            </p>
        </div>
    );
}