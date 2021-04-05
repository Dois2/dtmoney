import {useContext, createContext, ReactNode, useEffect, useState} from 'react';
import { api } from '../services/api';


interface ItransactionsContextData {
  transactions: ITransaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

interface ITransaction {
  id: number
  title:string ;
  type: string;
  amount: number;
  category: string;
  createdAt: string;
}
type TransactionInput = Omit<ITransaction, 'id' | 'createdAt'>
// Same as up /\ !!
// interface ITransactionInput {
//   type: string;
//   title: string;
//   category: string;
//   value: string;
// }
// type Transactioninput = Pick<ITransaction, 'type' |
// 'title' |
// 'category' |
// 'amount' >

interface ITransactionsProviderProps {
  children: ReactNode;
}

// criando o contexto para conseguir passar informações atravez da props value

const TransactionsContext = createContext<ItransactionsContextData>(
  {} as ItransactionsContextData
);


// Criando um Provider personalizado para calcular as transactions e retornar
// o context com os values props preenchidos
export function TransactionsProvider({children}:ITransactionsProviderProps) {

  const [transactions, setTransactions] = useState<ITransaction[]>([])

  
  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date()
    });
    const {transaction } = response.data;
    setTransactions([...transactions, transaction]);
  }


  useEffect(()=> {
  api.get('transactions')
    .then(response => {
      setTransactions(response.data.transactions)
    })    
  },[])

  return (
    <TransactionsContext.Provider value={{transactions, createTransaction}}>
      {children}
    </TransactionsContext.Provider>
  )
}



// Criando o hook para diminuir a quantidade de imports e usar um import do
// próprio hook ao invez do useContext
export function useTransactions(){
  const context = useContext(TransactionsContext);
  return context;
}