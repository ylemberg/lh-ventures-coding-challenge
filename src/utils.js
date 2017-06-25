export const stringToDate = str => {
  if (str === '*') {
    return new Date(str);
  }

  const [month, year] = str.split('-');
  return new Date(`${month} 1 20${year}`);
}

export const dateToString = d => {
  if (isNaN(d.valueOf())) {
    return '*';
  }

  const [day, month, date, year, ...rest] = d.toString().split(' ');
  return `${month.toUpperCase()}-${year.slice(2, 4)}`
}

export const parseCSV = str => {
  let [headers, ...lines] = str.split(';\n');

  headers = headers.split(';');

  return lines.map(line => {
    return line
      .split(';')
      .reduce((acc, value, i) => {
        if (['ACCOUNT', 'DEBIT', 'CREDIT'].includes(headers[i])) {
          acc[headers[i]] = parseInt(value, 10);
        } else if (headers[i] === 'PERIOD') {
          acc[headers[i]] = stringToDate(value);
        } else {
          acc[headers[i]] = value;
        }
        return acc;
      }, {});
  });
}

export const toCSV = arr => {
  let headers = Object.keys(arr[0]).join(';');
  let lines = arr.map(obj => Object.values(obj).join(';'));
  return [headers, ...lines].join(';\n');
}

export const parseUserInput = str => {
  const [
    startAccount, endAccount, startPeriod, endPeriod, format
  ] = str.split(' ');

  return {
    startAccount: parseInt(startAccount, 10),
    endAccount: parseInt(endAccount, 10),
    startPeriod: stringToDate(startPeriod),
    endPeriod: stringToDate(endPeriod),
    format
  };
}

export const sortByAccount = (balanceA, balanceB) => balanceA.ACCOUNT - balanceB.ACCOUNT

export const sortBalanceArr = balance => balance.sort(sortByAccount)

export const generateAccountsObj = accounts => {
  const accountsObj = {}

  accounts.forEach(account => {
    accountsObj[account.ACCOUNT] = account.LABEL
  });

  return accountsObj
}

export const getBalance = (debit, credit) => debit - credit

export const parseDescription = description => description || 'N/A'

export const indexOfAccountInArr = (balanceArr, accountNum) => balanceArr.findIndex(balanceObj => balanceObj.ACCOUNT === accountNum)

export const addEntryToAccount = (originalEntries, newEntry) => {
  originalEntries.DEBIT += newEntry.DEBIT;
  originalEntries.CREDIT += newEntry.CREDIT;
  originalEntries.BALANCE = getBalance(originalEntries.DEBIT, originalEntries.CREDIT);
  return originalEntries;
}

export const getNewBalanceEntry = (entry, description) => {
  const balanceVal = getBalance(entry.DEBIT, entry.CREDIT);
  const parsedDescription = parseDescription(description);
  return {
    ACCOUNT: entry.ACCOUNT,
    DEBIT: entry.DEBIT,
    CREDIT: entry.CREDIT,
    BALANCE: balanceVal,
    DESCRIPTION: parsedDescription
  };
}
