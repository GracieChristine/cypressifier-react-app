import React from 'react';

const ItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md" data-cy="item-card">
      <h3 className="text-lg font-semibold mb-2" data-cy="item-name">
        {item.name}
      </h3>
      <p className="text-gray-600 mb-4" data-cy="item-description">
        {item.description || 'No description'}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
          data-cy="item-edit"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          data-cy="item-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;