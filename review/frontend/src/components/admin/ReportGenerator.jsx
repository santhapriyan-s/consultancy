import React, { useState } from 'react';
import { FileText, FileSpreadsheet, PieChart, Printer } from 'lucide-react';
import { toast } from '../../components/ui/use-toast';

const ReportGenerator = ({ orders }) => {
  const [reportType, setReportType] = useState('summary');

  const generateReport = () => {
    if (!orders || orders.length === 0) {
      toast({
        title: "No Data Available",
        description: "There are no orders to generate a report from.",
        variant: "destructive"
      });
      return;
    }

    // Generate report based on type
    switch (reportType) {
      case 'summary':
        generateSummaryReport(orders);
        break;
      case 'detailed':
        generateDetailedReport(orders);
        break;
      case 'sales':
        generateSalesReport(orders);
        break;
      default:
        generateSummaryReport(orders);
    }

    toast({
      title: "Report Generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been generated.`,
    });
  };

  // Generate a basic summary report
  const generateSummaryReport = (orders) => {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status.toLowerCase() === 'pending').length;
    const deliveredOrders = orders.filter(order => order.status.toLowerCase() === 'delivered').length;
    
    let reportContent = `
      SR Electricals - Order Summary Report
      Generated on: ${new Date().toLocaleString()}
      
      Total Orders: ${totalOrders}
      Total Sales: ₹${totalSales.toFixed(2)}
      Pending Orders: ${pendingOrders}
      Delivered Orders: ${deliveredOrders}
    `;
    
    downloadReport(reportContent, 'summary-report.txt');
  };
  
  // Generate a detailed report with all orders
  const generateDetailedReport = (orders) => {
    let reportContent = `
      SR Electricals - Detailed Orders Report
      Generated on: ${new Date().toLocaleString()}
      
      ORDER DETAILS:
      ============================================
    `;
    
    orders.forEach((order, index) => {
      reportContent += `
        Order #${index + 1} (ID: ${order.id.substring(0, 8)})
        Date: ${new Date(order.date).toLocaleString()}
        Customer: ${order.shipping?.name || 'N/A'}
        Status: ${order.status}
        Total: ₹${order.total.toFixed(2)}
        
        Items:
        ${order.items.map(item => `- ${item.name} x ${item.quantity} (₹${item.price.toFixed(2)} each)`).join('\n        ')}
        
        Shipping Address:
        ${order.shipping?.addressLine1 || 'N/A'}
        ${order.shipping?.city || ''}, ${order.shipping?.state || ''} ${order.shipping?.pincode || ''}
        
        ============================================
      `;
    });
    
    downloadReport(reportContent, 'detailed-report.txt');
  };
  
  // Generate a sales analysis report
  const generateSalesReport = (orders) => {
    // Calculate total sales by status
    const salesByStatus = {};
    orders.forEach(order => {
      const status = order.status.toLowerCase();
      if (!salesByStatus[status]) salesByStatus[status] = 0;
      salesByStatus[status] += order.total;
    });
    
    // Calculate sales by date (month)
    const salesByMonth = {};
    orders.forEach(order => {
      const monthYear = new Date(order.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!salesByMonth[monthYear]) salesByMonth[monthYear] = 0;
      salesByMonth[monthYear] += order.total;
    });
    
    let reportContent = `
      SR Electricals - Sales Analysis Report
      Generated on: ${new Date().toLocaleString()}
      
      SALES BY STATUS:
      ===============================
    `;
    
    Object.keys(salesByStatus).forEach(status => {
      reportContent += `
        ${status.charAt(0).toUpperCase() + status.slice(1)}: ₹${salesByStatus[status].toFixed(2)}`;
    });
    
    reportContent += `
      
      SALES BY MONTH:
      ===============================`;
    
    Object.keys(salesByMonth).forEach(month => {
      reportContent += `
        ${month}: ₹${salesByMonth[month].toFixed(2)}`;
    });
    
    downloadReport(reportContent, 'sales-report.txt');
  };
  
  // Download the report as a text file
  const downloadReport = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold mb-4">Generate Reports</h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
            Report Type
          </label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="summary">Summary Report</option>
            <option value="detailed">Detailed Order Report</option>
            <option value="sales">Sales Analysis Report</option>
          </select>
        </div>
        
        <div className="self-end">
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors flex items-center gap-2"
          >
            {reportType === 'summary' && <FileText size={18} />}
            {reportType === 'detailed' && <FileSpreadsheet size={18} />}
            {reportType === 'sales' && <PieChart size={18} />}
            Generate Report
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        Reports will be downloaded as text files. For a real application, consider generating PDF reports.
      </div>
    </div>
  );
};

export default ReportGenerator;
