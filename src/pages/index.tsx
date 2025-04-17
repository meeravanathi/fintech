'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types/transaction';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<{
    amount: string;
    date: string;
    description: string;
  }>({
    amount: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data: Transaction[] = await res.json();
    setTransactions(data);
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.date || !form.description) {
      return alert("Fill all fields");
    }

    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    });

    setForm({ amount: '', date: '', description: '' });
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    fetchTransactions();
  };

  const dataForChart = transactions.reduce<{ name: string; total: number }[]>((acc, tx) => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(i => i.name === month);
    if (existing) existing.total += Number(tx.amount);
    else acc.push({ name: month, total: Number(tx.amount) });
    return acc;
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Personal Finance Tracker</h1>

      <Card className="p-4 mb-6">
        <h2 className="text-lg mb-2">Add Transaction</h2>
        <div className="flex gap-2 mb-2">
          <Input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <Button onClick={handleSubmit}>Add</Button>
        </div>
      </Card>

      <Card className="p-4 mb-6">
        <h2 className="text-lg mb-4">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dataForChart}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg mb-2">Transactions</h2>
        {transactions.map(tx => (
          <div key={tx._id} className="flex justify-between items-center border-b py-2">
            <div>
              <p className="text-sm font-medium">{tx.description}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(tx.date).toLocaleDateString()} - ₹{tx.amount}
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(tx._id)}>
              Delete
            </Button>
          </div>
        ))}
      </Card>
    </main>
  );
}
