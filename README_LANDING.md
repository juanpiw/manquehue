# Landing Page Setup Instructions

## Database Setup

### 1. Install MySQL/MariaDB
Make sure you have MySQL or MariaDB installed on your system.

### 2. Create Database and Tables
Run the following command to set up the database:

```bash
mysql -u root -p < database_setup.sql
```

Or manually execute the SQL commands in your MySQL client:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS landing_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE landing_db;

-- Create table
CREATE TABLE IF NOT EXISTS landing_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) DEFAULT 'general',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('nuevo', 'contactado', 'procesando', 'completado') DEFAULT 'nuevo',
    notas TEXT,
    INDEX idx_correo (correo),
    INDEX idx_fecha (fecha_creacion),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## PHP Configuration

### 1. Web Server Setup
Make sure you have a web server with PHP support (Apache, Nginx, or built-in PHP server).

### 2. PHP Extensions
Ensure the following PHP extensions are enabled:
- `pdo_mysql`
- `mail` (for email functionality)

### 3. Database Connection
Update the database credentials in `landing.php` if needed:

```php
$host = 'localhost';
$dbname = 'landing_db';
$username = 'root';
$password = ''; // Your MySQL password
```

### 4. Email Configuration
Update the email settings in `landing.php`:

```php
$admin_email = 'info@manquehue.cl'; // Your admin email
```

## File Structure

```
dashManqu/
├── video-scroll-demo.html      # Main landing page
├── landing.php                 # Backend form handler
├── database_setup.sql          # Database setup script
├── README_LANDING.md           # This file
└── js/                         # JavaScript modules
    ├── VideoScrollSystem.js
    ├── NavigationSystem.js
    ├── ComponentManager.js
    ├── AnimationController.js
    ├── ImageFilterSystem.js
    ├── ContentManager.js
    └── main.js
```

## Features Implemented

### 1. Project Request Modal
- **Location**: Fixed button in top-right corner
- **Functionality**: Opens modal with name and email inputs
- **Database**: Stores requests in `landing_requests` table
- **Email**: Sends notifications to admin and confirmation to user

### 2. Google Analytics Integration
- **Events Tracked**:
  - `project_modal_opened`: When modal is opened
  - `project_form_submitted`: When form is successfully submitted
  - `project_form_error`: When form submission fails

### 3. Form Validation
- **Client-side**: HTML5 validation (required fields, email format)
- **Server-side**: PHP validation and sanitization
- **Error Handling**: User-friendly error messages

### 4. Email Notifications
- **Admin Notification**: New request details sent to admin email
- **User Confirmation**: Thank you email sent to user
- **Headers**: Proper email headers for delivery

## Testing

### 1. Database Connection
Test the database connection by accessing `landing.php` directly in your browser.

### 2. Form Submission
1. Open `video-scroll-demo.html` in your browser
2. Click "Quiero una landing para mi proyecto"
3. Fill out the form and submit
4. Check database for new entry
5. Check email for notifications

### 3. Error Handling
Test error scenarios:
- Invalid email format
- Empty fields
- Database connection issues

## Security Notes

### 1. Database Security
- Use strong passwords for database users
- Consider creating a dedicated database user with limited permissions
- Regularly backup your database

### 2. Email Security
- Configure SPF, DKIM, and DMARC records for your domain
- Use a reliable email service (Gmail, SendGrid, etc.)
- Monitor email delivery rates

### 3. Input Validation
- All inputs are validated and sanitized
- SQL injection protection via PDO prepared statements
- XSS protection via proper output encoding

## Customization

### 1. Email Templates
Modify the email messages in `landing.php`:

```php
$user_message = "Hola " . $nombre . ",\n\n";
$user_message .= "Gracias por tu interés...";
```

### 2. Database Fields
Add additional fields to the form and database as needed:

```sql
ALTER TABLE landing_requests ADD COLUMN telefono VARCHAR(20);
ALTER TABLE landing_requests ADD COLUMN empresa VARCHAR(255);
```

### 3. Styling
The modal styling is inline in the HTML. You can move it to CSS for better organization.

## Troubleshooting

### 1. Database Connection Issues
- Check MySQL service is running
- Verify database credentials
- Ensure database and table exist

### 2. Email Not Sending
- Check PHP mail configuration
- Verify SMTP settings
- Check server logs for errors

### 3. Form Not Working
- Check browser console for JavaScript errors
- Verify PHP error logs
- Test database connection manually

## Production Deployment

### 1. Environment Variables
Consider using environment variables for sensitive data:

```php
$host = $_ENV['DB_HOST'] ?? 'localhost';
$username = $_ENV['DB_USER'] ?? 'root';
$password = $_ENV['DB_PASS'] ?? '';
```

### 2. HTTPS
Ensure your site uses HTTPS in production for security.

### 3. Monitoring
Set up monitoring for:
- Database performance
- Email delivery rates
- Form submission success rates

### 4. Backup
Implement regular backups of:
- Database
- PHP files
- Configuration files
