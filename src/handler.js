const { nanoid } = require('nanoid');
const books = require('./books');
function filterName(arr, searchKey) {
  return arr.filter(i => i.name.toLowerCase().includes(searchKey.toLowerCase()));
}

function filterReading(arr, searchKey) {
  if(searchKey=='0'){
    searchKey = false
  }else if(searchKey=='1'){
    searchKey = true
  }
  return arr.filter(i=>i.reading==searchKey);
}

function filterFinished(arr, searchKey) {
  if(searchKey=='0'){
    searchKey = false
  }else if(searchKey =='1'){
    searchKey = true
  }
  return arr.filter(i=>i.finished==searchKey);
}
// Fungsi Add new Book 
const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false
  // Jika name kosong 
  if (name == "" || name == undefined) {
    const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  response.code(400);
  return response;
  }

  // Jika readPage lebih besar dari pada pageCount
  if(readPage > pageCount){
    const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if(readPage==pageCount) {
    finished = true
  }
  const newBooks = {id, name, year, author, summary, publisher, pageCount, readPage,finished, reading, insertedAt, updatedAt,};
  
  books.push(newBooks);
 
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Fungsi get All Book
  const getAllBooksHandler = (request, h) => {
    const { name="", reading="", finished="" } = request.query;
    let status = false

    if(name.length !=0 ){
      newBooks = filterName(books,name)
      status = true
    } else if(reading.length){
      newBooks = filterReading(books, reading)
      status = true
    }else if (finished.length !=0){
      newBooks = filterFinished(books, finished)
      status = true
    }

    if(status==true){
    return{
    status: 'success',
    data: {
      books:newBooks.map(function(value) {
        return { 'id': value.id, "name": value.name, "publisher": value.publisher}
      })
    },
  }}else{
    return{
      status: 'success',
      data: {
        books:books.map(function(value) {
          return { 'id': value.id, "name": value.name, "publisher": value.publisher}
        })
      },
    }
  }};

  // Fungsi get data book by id
  const getBooksByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const book = books.filter((n) => n.id === id)[0];
   
   if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };
  

  const editBooksByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
     // Jika name kosong 
  if (name == "" || name == undefined) {
    const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  response.code(400);
  return response;
  }

  // Jika readPage lebih besar dari pada pageCount
  if(readPage > pageCount){
    const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } 
   
    const index = books.findIndex((books) => books.id === id);
   
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
      };
   
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  const deleteBooksByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const index = books.findIndex((books) => books.id === id);
 
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
 
 const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};



 
module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
 
};