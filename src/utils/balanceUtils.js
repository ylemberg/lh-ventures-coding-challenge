import * as parseUtils from './parseUtils';

export const sortByAccount = (balanceA, balanceB) => balanceA.ACCOUNT - balanceB.ACCOUNT

export const sortBalanceArr = balance => balance.sort(sortByAccount)

export const generateAccountsObj = accounts => {
  const accountsObj = {}

  accounts.forEach(account => {
    accountsObj[account.ACCOUNT] = account.LABEL
  });

  return accountsObj
}

export const getBalanceVal = (debit, credit) => debit - credit

export const indexOfAccountInArr = (balanceArr, accountNum) =>
  balanceArr.findIndex(balanceObj => balanceObj.ACCOUNT === accountNum)

export const addEntryToAccount = (originalEntries, newEntry) => {
  originalEntries.DEBIT += newEntry.DEBIT;
  originalEntries.CREDIT += newEntry.CREDIT;
  originalEntries.BALANCE = getBalanceVal(originalEntries.DEBIT, originalEntries.CREDIT);
  return originalEntries;
}

export const getDateOfEntry = date => {
  return {
    month: date.getMonth(),
    year: date.getFullYear()
  }
}

export const getNewBalanceEntry = (entry, description) => {
  const balanceVal = getBalanceVal(entry.DEBIT, entry.CREDIT);
  const parsedDescription = parseUtils.parseDescription(description);
  // const { month, year } = getDateOfEntry(entry.PERIOD)
  return {
    ACCOUNT: entry.ACCOUNT,
    DEBIT: entry.DEBIT,
    CREDIT: entry.CREDIT,
    BALANCE: balanceVal,
    DESCRIPTION: parsedDescription
  };
}

export const getBalanceArr = (journalEntries, accounts) => {
  return journalEntries.reduce((balance, journalEntry) => {
    const description = accounts[journalEntry.ACCOUNT];
    const idx = indexOfAccountInArr(balance, journalEntry.ACCOUNT);

    if (idx === -1) {
      balance.push(getNewBalanceEntry(journalEntry, description));
    } else {
      balance[idx] = addEntryToAccount(balance[idx], journalEntry);
    }

    return balance;
  }, [])
}

export const filterJournalEntriesByAccount = (arr, { startAccount, endAccount }) =>
  arr.filter(entry => entry.ACCOUNT >= startAccount && entry.ACCOUNT <= endAccount)

export const dateInRange = (entryMonth, entryYear, start, end) => {
  if (entryYear < start.year || entryYear > end.year) {
    return false
  } else if (start.year === end.year) {
    return entryMonth >= start.month && entryMonth <= end.month
  } else if (start.year !== end.year && entryYear === start.year) {
    return entryMonth >= start.month
  } else if (start.year !== end.year && entryYear === end.year) {
    return entryMonth <= end.month
  }
  return true
}

export const filterJournalEntriesByDate = (entries, { startPeriod, endPeriod }) => {
  if (startPeriod && endPeriod) {
    const startDate = getDateOfEntry(startPeriod)
    const endDate = getDateOfEntry(endPeriod)
    return entries.filter(entry => {
      const { month, year } = getDateOfEntry(entry.PERIOD)
      return dateInRange(month, year, startDate, endDate)
    })
  }
  return entries
}