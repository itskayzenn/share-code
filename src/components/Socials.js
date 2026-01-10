import { Github, Instagram, Send, MessageCircle } from 'lucide-react';

const Socials = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 mt-10 border-t border-gray-800">
      <h3 className="text-gray-400 mb-4 text-sm">Connect with Developer</h3>
      <div className="flex gap-6">
        {/* Ganti href dengan link asli Anda */}
        <a href="https://github.com/Kayzen-dev-tech" target="_blank" className="hover:text-white text-gray-400 transition">
          <Github size={24} />
        </a>
        <a href="https://instagram.com/kayzenfry" target="_blank" className="hover:text-pink-500 text-gray-400 transition">
          <Instagram size={24} />
        </a>
        <a href="https://wa.me/628152313006" target="_blank" className="hover:text-green-500 text-gray-400 transition">
          <MessageCircle size={24} />
        </a>
        <a href="https://t.me/nonewpo" target="_blank" className="hover:text-blue-400 text-gray-400 transition">
          <Send size={24} />
        </a>
        <a href="https://whatsapp.com/channel/0029VbAXhS26WaKugBLx4E05" target="_blank" className="hover:text-green-400 text-gray-400 transition font-bold">
           WA Ch.
        </a>
      </div>
    </div>
  );
};

export default Socials;
    
