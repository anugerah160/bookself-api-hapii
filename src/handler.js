const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(10);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount,
    readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  const responseBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: responseBooks,
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book,
    },
  }).code(200);
};
const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // Update data buku
  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    updatedAt: new Date().toISOString(),
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  // Menghapus buku dari array
  books.splice(bookIndex, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };