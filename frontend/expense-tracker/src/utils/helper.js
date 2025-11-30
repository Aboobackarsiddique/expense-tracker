export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
export const getInitials = (name) => {
    if(!name) return "";
    const words = name.split(" ");
    let Initials = "";
    for(let i=0; i < Math.min(2,words.length) ;i++){
        Initials += words[i][0];
    }
    return Initials.toUpperCase();
}
export const addThousandsSeperator = (num) => {
    if(num == null || isNaN(num)) return "";

const [integerPart, fractionalPart] = num.toString().split(".");
const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",")

return fractionalPart
    ? `${formattedInteger}.${formattedInteger}`
    : formattedInteger
}
export const prepareExpenseBarChartData = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }
    
    // Group expenses by category and sum amounts
    const categoryMap = {};
    
    data.forEach((item) => {
        const category = item?.category || 'Uncategorized';
        const amount = Number(item?.amount) || 0;
        
        if (categoryMap[category]) {
            categoryMap[category] += amount;
        } else {
            categoryMap[category] = amount;
        }
    });
    
    // Convert to array format for chart
    const chartData = Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount: Math.round(amount), // Round to avoid decimal issues
    }));
    
    return chartData;
}

export const prepareIncomeBarChartData = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }
    
    // Group income by date and sum amounts
    const dateMap = {};
    
    data.forEach((item) => {
        const date = item?.date ? new Date(item.date) : new Date();
        // Format date as "Do MMM" (e.g., "1st Feb")
        const dateKey = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const formattedDate = formatDateForChart(date);
        const amount = Number(item?.amount) || 0;
        
        if (dateMap[formattedDate]) {
            dateMap[formattedDate] += amount;
        } else {
            dateMap[formattedDate] = amount;
        }
    });
    
    // Convert to array format for chart, sorted by date
    const chartData = Object.entries(dateMap)
        .map(([date, amount]) => ({
            date,
            amount: Math.round(amount),
        }))
        .sort((a, b) => {
            // Sort by date (convert back to date for sorting)
            const dateA = parseChartDate(a.date);
            const dateB = parseChartDate(b.date);
            return dateA - dateB;
        });
    
    return chartData;
}

// Helper to format date as "1st Feb", "2nd Feb", etc.
const formatDateForChart = (date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const suffix = getDaySuffix(day);
    return `${day}${suffix} ${month}`;
}

// Helper to get day suffix (st, nd, rd, th)
const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Helper to parse chart date back to Date object for sorting
const parseChartDate = (dateStr) => {
    // Parse "1st Feb" format
    const match = dateStr.match(/(\d+)(st|nd|rd|th)\s+(\w+)/);
    if (match) {
        const day = parseInt(match[1]);
        const monthStr = match[3];
        const monthMap = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const month = monthMap[monthStr] || 0;
        const year = new Date().getFullYear();
        return new Date(year, month, day);
    }
    return new Date();
}

export const prepareExpenseLineChartData = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }
    
    // Group expenses by date and sum amounts
    const dateMap = {};
    
    data.forEach((item) => {
        const date = item?.date ? new Date(item.date) : new Date();
        const formattedDate = formatDateForChart(date);
        const amount = Number(item?.amount) || 0;
        
        if (dateMap[formattedDate]) {
            dateMap[formattedDate] += amount;
        } else {
            dateMap[formattedDate] = amount;
        }
    });
    
    // Convert to array format for chart, sorted by date
    const chartData = Object.entries(dateMap)
        .map(([date, amount]) => ({
            date,
            amount: Math.round(amount),
        }))
        .sort((a, b) => {
            // Sort by date (convert back to date for sorting)
            const dateA = parseChartDate(a.date);
            const dateB = parseChartDate(b.date);
            return dateA - dateB;
        });
    
    return chartData;
}