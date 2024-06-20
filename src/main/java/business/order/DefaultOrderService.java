package business.order;

import api.ApiException;
import business.JdbcUtils;
import business.book.Book;
import business.book.BookDao;
import business.cart.ShoppingCart;
import business.cart.ShoppingCartItem;
import business.customer.CustomerDao;
import business.customer.CustomerForm;
import business.BookstoreDbException;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.DateTimeException;
import java.time.YearMonth;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import business.customer.Customer;
public class DefaultOrderService implements OrderService {

	private BookDao bookDao;

	private OrderDao orderDao;

	private LineItemDao lineItemDao;

	private CustomerDao customerDao;

	public void setBookDao(BookDao bookDao) {
		this.bookDao = bookDao;
	}

	public void setOrderDao(OrderDao orderDao) {
		this.orderDao = orderDao;
	}

	public void setCustomerDao(CustomerDao customerDao) {
		this.customerDao = customerDao;
	}

	public void setLineItemDao(LineItemDao lineItemDao) {
		this.lineItemDao = lineItemDao;
	}

	public OrderDetails getOrderDetails(long orderId) {
		Order order = orderDao.findByOrderId(orderId);
		Customer customer = customerDao.findByCustomerId(order.customerId());
		List<LineItem> lineItems = lineItemDao.findByOrderId(orderId);

		List<Book> books = lineItems.stream()
				.map(lineItem -> bookDao.findByBookId(lineItem.bookId()))
				.collect(Collectors.toList());

		return new OrderDetails(order, customer, lineItems, books);
	}

	@Override
    public long placeOrder(CustomerForm customerForm, ShoppingCart cart) {

		validateCustomer(customerForm);
		validateCart(cart);

		try (Connection connection = JdbcUtils.getConnection()) {
			Date ccExpDate = getCardExpirationDate(
					customerForm.getCcExpiryMonth(),
					customerForm.getCcExpiryYear());
			return performPlaceOrderTransaction(
					customerForm.getName(),
					customerForm.getAddress(),
					customerForm.getPhone(),
					customerForm.getEmail(),
					customerForm.getCcNumber(),
					ccExpDate, cart, connection);
		} catch (SQLException e) {
			System.err.println("Error during close connection for customer order: " + e.getMessage());
			return -1;
		}
	}

	private Date getCardExpirationDate(String monthString, String yearString) {
		try {
			int year = Integer.parseInt(yearString);
			int month = Integer.parseInt(monthString);

			Calendar calendar = Calendar.getInstance();
			calendar.clear();
			calendar.set(Calendar.YEAR, year);
			calendar.set(Calendar.MONTH, month - 1);
			calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH)); // Set to the last day of the month

			java.util.Date utilDate = calendar.getTime();
			return new java.sql.Date(utilDate.getTime());
		} catch (NumberFormatException e) {
			throw new ApiException.ValidationFailure("Invalid expiration date provided.");
		}
	}


	private long performPlaceOrderTransaction(
			String name, String address, String phone,
			String email, String ccNumber, Date date,
			ShoppingCart cart, Connection connection) {
		try {
			connection.setAutoCommit(false);
			long customerId = customerDao.create(
					connection, name, address, phone, email,
					ccNumber, date);
			long customerOrderId = orderDao.create(
					connection,
					cart.getComputedSubtotal() + cart.getSurcharge(),
					generateConfirmationNumber(), customerId);
			for (ShoppingCartItem item : cart.getItems()) {
				lineItemDao.create(connection, customerOrderId,
						item.getBookId(), item.getQuantity());
			}
			connection.commit();
			return customerOrderId;
		} catch (Exception e) {
			try {
				connection.rollback();
			} catch (SQLException e1) {
				throw new BookstoreDbException("Failed to roll back transaction", e1);
			}
			return 0;
		}
	}

	public static int generateConfirmationNumber() {
		return ThreadLocalRandom.current().nextInt(999999999);
	}

	private void validateCustomer(CustomerForm customerForm) {

    	String name = customerForm.getName();

		if(name == null) {
			throw new ApiException.ValidationFailure("name","Missing name field");
		}
		if (name.length() < 4 || name.length() > 45) {
			throw new ApiException.ValidationFailure("name","Invalid name field");
		}

		// TODO: Validation checks for address, phone, email, ccNumber

		String address = customerForm.getAddress();
		if(address == null) {
			throw new ApiException.ValidationFailure("address","Missing address field");
		}
		if (address.length() < 4 || address.length() > 45) {
			throw new ApiException.ValidationFailure("address","Invalid address field");
		}
		String phone = customerForm.getPhone();
		if(phone == null) {
			throw new ApiException.ValidationFailure("phone","Missing phone field");
		}
		if (!validatePhoneNumber(phone)) {
			throw new ApiException.ValidationFailure("phone","Invalid phone number");
		}

		String email = customerForm.getEmail();
		if(email == null) {
			throw new ApiException.ValidationFailure("email","Missing email field");
		}
		if (email.contains(" ") || !email.contains("@") || email.endsWith(".")) {
			throw new ApiException.ValidationFailure("email","Invalid email address");
		}

		String ccNumber = customerForm.getCcNumber();
		if(ccNumber == null) {
			throw new ApiException.ValidationFailure("ccNumber","Missing ccNumber field");
		}
		String ccNumberDigits = ccNumber.replaceAll("[\\s\\-]", "");
		if (ccNumberDigits.length() < 14 || ccNumberDigits.length() > 16) {
			throw new ApiException.ValidationFailure("ccNumber","Invalid credit card number");
		}

		if (expiryDateIsInvalid(customerForm.getCcExpiryMonth(), customerForm.getCcExpiryYear())) {
			throw new ApiException.ValidationFailure("", "Please enter a valid expiration date");

		}

	}

	public boolean validatePhoneNumber(String phoneNumber) {
		String cleanedNumber = phoneNumber.replaceAll("[^\\d+x-]", "");

		if (cleanedNumber.contains("x")) {
			if (!cleanedNumber.matches("^\\+?\\d*x\\d*$")) {
				return false;
			}
		} else {
			if (cleanedNumber.matches("^.*x.*[a-zA-Z].*$")) {
				return false;
			}
		}

		String usMobileRegex = "^((\\+1|1)?( |-)?)?(\\([2-9][0-9]{2}\\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})(x\\d+)?$";

		String internationalRegex = "^\\+1\\d*(x\\d+)?$";

		boolean isUsMobileNumberValid = cleanedNumber.matches(usMobileRegex) && !cleanedNumber.contains("--");
		boolean isInternationalNumberValid = cleanedNumber.matches(internationalRegex) && !cleanedNumber.contains("--");

		return isUsMobileNumberValid || isInternationalNumberValid;
	}



	private boolean expiryDateIsInvalid(String ccExpiryMonth, String ccExpiryYear) {
		try {
			int month = Integer.parseInt(ccExpiryMonth);
			int year = Integer.parseInt(ccExpiryYear);
			YearMonth current = YearMonth.now();
			YearMonth expiry = YearMonth.of(year, month);

			return expiry.isBefore(current);
		} catch (NumberFormatException e) {
			System.err.println("Error parsing month or year: " + e.getMessage());
			return true;
		} catch (DateTimeException e) {
			System.err.println("Error creating YearMonth instance: " + e.getMessage());
			return true;
		}
	}

	private void validateCart(ShoppingCart cart) {

		if (cart.getItems().size() <= 0) {
			throw new ApiException.ValidationFailure("Cart is empty.");
		}

		cart.getItems().forEach(item-> {
			if (item.getQuantity() < 0 || item.getQuantity() > 99) {
				throw new ApiException.ValidationFailure("Invalid quantity");
			}
			Book databaseBook = bookDao.findByBookId(item.getBookId());
			if (databaseBook == null) {
				throw new ApiException.ValidationFailure("Book with ID " + item.getBookId() + " not found in the database.");
			}

			if (item.getPrice() != databaseBook.price()) {
				throw new ApiException.ValidationFailure("Invalid price for item with ID: " + item.getBookId());
			}

			if (!(item.getCategoryId() == databaseBook.categoryId())) {
				throw new ApiException.ValidationFailure("Invalid category for item with ID: " + item.getCategoryId());
			}
		});
	}

}
