const CustomerListItem = ({ customer, onEdit }) => {
  return (
    <div className="bg-gray-100 hover:bg-gray-200 shadow-md rounded-lg mb-4 p-4 relative">
      <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
        <h2 className="text-xl font-semibold">{customer.companyname}</h2>
        <div>
          <button onClick={() => onEdit(customer._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">Edit</button>
        </div>
      </div>
      <ul>
        <li><strong>Firma Türü:</strong> {customer.companytype}</li>
        <li><strong>Sektör:</strong> {customer.companysector}</li>
        <li><strong>Web Sitesi:</strong> {customer.companyweb}</li>
        <li><strong>Ülke:</strong> {customer.companycountry}</li>
        <li><strong>Şehir:</strong> {customer.companycity}</li>
        <li><strong>İlçe:</strong> {customer.companycounty}</li>
        <li><strong>Adres:</strong> {customer.companyadress}</li>
        <li><strong>İlgili Kişi:</strong> {customer.contactname}</li>
        <li><strong>İlgili Kişi Numarası:</strong> {customer.contactnumber}</li>
        <li><strong>İlgili Kişi Email:</strong> {customer.contactmail}</li>
      </ul>
      
    </div>
  );
};
  export default CustomerListItem;