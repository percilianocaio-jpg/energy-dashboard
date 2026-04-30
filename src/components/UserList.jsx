import { motion, AnimatePresence } from "framer-motion";
import UserCard from "./UserCard";
import SkeletonCard from "./SkeletonCard";

function UserList({ usuarios, loading, error }) {
  if (loading) {
    return (
      <div className="user-list-container">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>⚠️ Erro ao carregar</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!loading && usuarios.length === 0) {
    return (
      <div className="empty-state">
        <h3>🔍 Nenhum resultado</h3>
        <p>Tente ajustar sua busca ou limpar os filtros</p>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <AnimatePresence mode="popLayout">
        {usuarios.map((usuario) => (
          <motion.div
            key={usuario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UserCard usuario={usuario} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default UserList;
