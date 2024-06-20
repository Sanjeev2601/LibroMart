package business.book;

import business.BookstoreDbException;
import business.JdbcUtils;
import business.category.Category;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public interface BookDao {

    public Book findByBookId(long bookId);

    public List<Book> findByCategoryId(long categoryId);

    public List<Book> findRandomByCategoryId(long categoryId, int limit);

    public List<Book> booksByCategoryName(String categoryName);

    public List<Book> suggestedBooksByCategoryName(String categoryName, int limit);

}
