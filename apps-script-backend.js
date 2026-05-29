function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    const rows = allData.slice(1);
    
    const phoneIndex = headers.indexOf('PhoneNumber');
    const emailIndex = headers.indexOf('Email');
    
    const newEmail = data.email.toString().trim().toLowerCase();
    const newPhone = data.phoneNumber.toString().trim();
    
    console.log('Checking Email:', newEmail, 'Phone:', newPhone);
    
    // CHECK IF ADMIN ALREADY EXISTS - Only first user can be admin
    if (rows.length > 0) {
      console.log('Admin already exists. Registration denied.');
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error', 
        message: 'Admin account already exists. Only one admin user is allowed.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    for (let i = 0; i < rows.length; i++) {
      const rowEmail = rows[i][emailIndex].toString().trim().toLowerCase();
      const rowPhone = rows[i][phoneIndex].toString().trim();
      
      if (emailIndex!== -1 && rowEmail === newEmail && newEmail!== '') {
        console.log('Found duplicate email at row:', i + 2, 'Value:', rowEmail);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error', 
          message: 'Email already registered'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      if (phoneIndex!== -1 && rowPhone === newPhone && newPhone!== '') {
        console.log('Found duplicate phone at row:', i + 2, 'Value:', rowPhone);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error', 
          message: 'Phone number already registered'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Add first user as ADMIN
    sheet.appendRow([
      data.firstName,
      data.secondName, 
      data.phoneNumber,
      data.email,
      data.password,
      new Date()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Admin account created successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error', 
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  // LOGIN CHECK - Only first user is admin
  if (e && e.parameter && e.parameter.type === 'login') {
    const emailIndex = headers.indexOf('Email');
    const passwordIndex = headers.indexOf('Password');
    const firstNameIndex = headers.indexOf('FirstName');
    const secondNameIndex = headers.indexOf('SecondName');
    
    const inputEmail = e.parameter.email?.toString().toLowerCase().trim();
    const inputPassword = e.parameter.password?.toString().trim();
    
    for (let i = 0; i < rows.length; i++) {
      const sheetEmail = rows[i][emailIndex]?.toString().toLowerCase().trim();
      const sheetPassword = rows[i][passwordIndex]?.toString().trim();
      
      if (sheetEmail === inputEmail && sheetPassword === inputPassword) {
        // ONLY FIRST USER (i === 0) IS ADMIN
        const isAdmin = (i === 0);
        
        if (!isAdmin) {
          // Not the first user, deny access
          return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Only the first registered user can access the admin panel',
            isAdmin: false
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          user: rows[i][firstNameIndex] + ' ' + rows[i][secondNameIndex],
          email: rows[i][emailIndex],
          firstName: rows[i][firstNameIndex],
          lastName: rows[i][secondNameIndex],
          isAdmin: true
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error', 
      message: 'Invalid credentials'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Default: return all data for admin page
  const jsonData = rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}