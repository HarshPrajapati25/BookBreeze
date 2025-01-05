const Book = require('../models/Book');
const BookLending = require('../models/BookLending');
const nodemailer = require('nodemailer');

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, publicationYear } = req.body;
    const ownerId = req.user.id; // From auth middleware

    const book = new Book({
      title,
      author,
      description,
      publicationYear,
      ownerId
    });

    await book.save();

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

exports.listOwnBooks = async (req, res) => {
  try {
    const books = await Book.find({ ownerId: req.user.id });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

exports.listAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({
      ownerId: { $ne: req.user.id },
      isAvailable: true
    }).populate('ownerId', 'name email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

exports.requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const borrowerId = req.user.id;

    const book = await Book.findById(bookId).populate('ownerId');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    const bookLending = new BookLending({
      bookId,
      borrowerId,
      lenderId: book.ownerId._id,
      status: 'PENDING'
    });

    await bookLending.save();

    // Update book availability
    book.isAvailable = false;
    await book.save();

    // Send email to book owner
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: book.ownerId.email,
      subject: 'New Book Request',
      text: `You have a new request for your book "${book.title}" from ${req.user.name}.`
    });

    res.status(201).json({
      message: 'Book request sent successfully',
      request: bookLending
    });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting book', error: error.message });
  }
};

// Add new endpoint to get lending details for owner
exports.getLendingDetails = async (req, res) => {
  try {
    const lenderId = req.user.id;
    
    const lendings = await BookLending.find({ lenderId })
      .populate('bookId')
      .populate('borrowerId', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.json(lendings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lending details', error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const lenderId = req.user.id;  // Current user (book owner)

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify the book belongs to the current user
    if (book.ownerId.toString() !== lenderId) {
      return res.status(403).json({ message: 'Not authorized to mark this book as returned' });
    }

    // Find the latest lending record for this book
    const lending = await BookLending.findOne({
      bookId,
      lenderId,
      status: { $in: ['ACCEPTED', 'PENDING'] }
    }).populate('borrowerId');

    if (!lending) {
      return res.status(404).json({ message: 'No active lending found for this book' });
    }

    // Update the lending status
    lending.status = 'RETURNED';
    lending.returnDate = new Date();
    await lending.save();

    // Update book availability
    book.isAvailable = true;
    await book.save();

    // Send email to borrower
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: lending.borrowerId.email,
      subject: 'Book Return Confirmed',
      text: `The book "${book.title}" has been marked as returned. Thank you for using our book lending service!`
    });

    res.json({
      message: 'Book marked as returned successfully',
      book,
      lending
    });
  } catch (error) {
    res.status(500).json({ message: 'Error returning book', error: error.message });
  }
};

// Add this method to get borrowed books for a user
exports.getBorrowedBooks = async (req, res) => {
  try {
    const borrowerId = req.user.id;

    const borrowedBooks = await BookLending.find({
      borrowerId,
      status: { $in: ['ACCEPTED', 'PENDING'] }
    })
    .populate('bookId')
    .populate('lenderId', 'name email phoneNumber')
    .sort({ createdAt: -1 });

    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowed books', error: error.message });
  }
};

// exports.requestBook = async (req, res) => {
//   try {
//     const { bookId } = req.body;
//     const borrowerId = req.user.id;

//     const book = await Book.findById(bookId).populate('ownerId');
//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     if (!book.isAvailable) {
//       return res.status(400).json({ message: 'Book is not available' });
//     }

//     const bookLending = new BookLending({
//       bookId,
//       borrowerId,
//       lenderId: book.ownerId._id
//     });

//     await bookLending.save();

//     // Send email to book owner
//     const transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       port: Number(process.env.MAIL_PORT), // Ensure the port is a number
//       secure: process.env.MAIL_SECURE === "true", // true for 465, false for other ports
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });
//     console.log(transporter,"transporter================<");
    

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: book.ownerId.email,
//       subject: 'New Book Request',
//       text: `You have a new request for your book "${book.title}" from ${req.user.name}.`
//     });

//     res.status(201).json({
//       message: 'Book request sent successfully',
//       request: bookLending
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error requesting book', error: error.message });
//   }
// };