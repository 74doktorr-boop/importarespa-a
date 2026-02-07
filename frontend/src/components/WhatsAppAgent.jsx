import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronRight, Bot } from 'lucide-react';

const WhatsAppAgent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const [hasOpened, setHasOpened] = useState(false);
    const messagesEndRef = useRef(null);

    const BUSINESS_PHONE = "34666351319"; // User's phone number

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial Greeting Logic
    useEffect(() => {
        if (isOpen && !hasOpened) {
            setHasOpened(true);
            setIsTyping(true);

            // Simulate typing delay
            setTimeout(() => {
                setIsTyping(false);
                setMessages([
                    {
                        id: 1,
                        type: 'bot',
                        text: "¡Hola! 👋 Soy el asistente virtual de Importar España. ¿En qué puedo ayudarte hoy?"
                    }
                ]);
            }, 1500);
        }
    }, [isOpen, hasOpened]);

    const handleOptionClick = (option) => {
        // Add user selection to chat
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: option.label }]);

        // Simulate bot thinking/typing
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);

            if (option.action === 'link') {
                // Construct WhatsApp URL
                const text = encodeURIComponent(option.message);
                const url = `https://wa.me/${BUSINESS_PHONE}?text=${text}`;

                // Add bot response
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: "Perfecto, te redirijo a WhatsApp para que un agente humano te atienda personalmente. 🚀"
                }]);

                // Redirect after a short delay
                setTimeout(() => {
                    window.open(url, '_blank');
                }, 1000);
            } else {
                // Local Response (Bot Answer)
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: option.response
                }]);
            }

        }, 1000);
    };

    const options = [
        {
            label: "Quiero importar un coche 🚗",
            action: 'link',
            message: "Hola, estoy interesado en importar un coche. ¿Podéis ayudarme con el proceso?"
        },
        {
            label: "¿Cómo funciona? ⚙️",
            action: 'text',
            response: "Es muy sencillo: 1. Buscas el coche en nuestra web (analizamos mobile.de). 2. Ves el precio final con todo incluido. 3. Si te encaja, nos encargamos de traerlo, matricularlo y entregártelo llave en mano. 🗝️"
        },
        {
            label: "¿Quiénes somos? 🏢",
            action: 'text',
            response: "Somos expertos en importación de vehículos de Alemania a España. Nos encargamos de toda la burocracia, transporte y legalización para que tú solo disfrutes de tu nuevo coche. Máxima transparencia y seguridad. 🛡️"
        },
        {
            label: "Hablar con un humano 👤",
            action: 'link',
            message: "Hola, me gustaría hablar directamente con un agente."
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 font-sans"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <Bot size={24} />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Asistente Importar España</h3>
                                    <p className="text-blue-200 text-xs">En línea ahora</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="h-[350px] bg-slate-50 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user'
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1">
                                            <motion.div
                                                className="w-2 h-2 bg-slate-400 rounded-full"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                            />
                                            <motion.div
                                                className="w-2 h-2 bg-slate-400 rounded-full"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                            />
                                            <motion.div
                                                className="w-2 h-2 bg-slate-400 rounded-full"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Options Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <p className="text-xs text-slate-400 mb-3 text-center">Selecciona una opción para continuar</p>
                            <div className="space-y-2">
                                {options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionClick(option)}
                                        className="w-full p-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-between group"
                                    >
                                        {option.label}
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-slate-800 text-white' : 'bg-[#25D366] text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}

                {/* Notification Badge */}
                {!isOpen && !hasOpened && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </motion.button>
        </div>
    );
};

export default WhatsAppAgent;
