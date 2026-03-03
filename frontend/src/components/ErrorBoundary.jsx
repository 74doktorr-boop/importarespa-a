import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleReset = () => {
        localStorage.clear(); // Clear potentially corrupted state
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-red-100">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={40} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                            Algo no ha salido como esperábamos
                        </h1>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Hemos detectado un error al renderizar la página. No te preocupes, puedes volver al inicio o intentar recargar la herramienta.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                            >
                                <RefreshCcw size={20} /> REINTENTAR CARGA
                            </button>

                            <button
                                onClick={this.handleReset}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
                                title="Borra todos los datos locales para solucionar errores persistentes"
                            >
                                <RefreshCcw size={20} /> LIMPIAR Y REINICIAR (SOLUCIÓN TOTAL)
                            </button>

                            <a
                                href="/"
                                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-all active:scale-95"
                            >
                                <Home size={20} /> VOLVER AL INICIO
                            </a>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-slate-50 rounded-lg text-left overflow-auto max-h-40">
                                <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold mb-2">Debug Error Info:</p>
                                <code className="text-xs text-slate-400">
                                    {this.state.error && this.state.error.toString()}
                                </code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
