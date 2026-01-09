import React, { useState, useEffect } from 'react';
import ItemForm from './ItemForm';
import ItemCard from './ItemCard';

const ItemList = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('items');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const handleAdd = (itemData) => {
    const newItem = {
      id: Date.now(),
      ...itemData,
      createdAt: new Date().toISOString()
    };
    setItems([...items, newItem]);
  };

  const handleUpdate = (id, itemData) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, ...itemData } : item
    ));
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Items Management</h1>
      
      <ItemForm
        item={editingItem}
        onSubmit={editingItem ? handleUpdate : handleAdd}
        onCancel={() => setEditingItem(null)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-8" data-cy="no-items">
            No items yet. Add your first item above!
          </p>
        ) : (
          items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={setEditingItem}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ItemList;