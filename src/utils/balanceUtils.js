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

export const getDateOfEntry = entry => {
  return {
    month: entry.PERIOD.getMonth(),
    year: entry.PERIOD.getFullYear()
  }
}

export const getNewBalanceEntry = (entry, description) => {
  const balanceVal = getBalanceVal(entry.DEBIT, entry.CREDIT);
  const parsedDescription = parseUtils.parseDescription(description);
  const { month, year } = getDateOfEntry(entry)
  return {
    ACCOUNT: entry.ACCOUNT,
    DEBIT: entry.DEBIT,
    CREDIT: entry.CREDIT,
    BALANCE: balanceVal,
    DESCRIPTION: parsedDescription,
    MONTH: month,
    YEAR: year
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

export const filterJournalEntriesByDate = (entries, { PERIOD }) => {
  return entries
}