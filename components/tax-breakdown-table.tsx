"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TaxBreakdownTable() {
  // Canadian federal tax bracket data for 2025
  const canadianFederalBrackets = [
    { rate: "15%", income: "$0 - $53,359" },
    { rate: "20.5%", income: "$53,360 - $106,717" },
    { rate: "26%", income: "$106,718 - $165,430" },
    { rate: "29%", income: "$165,431 - $235,675" },
    { rate: "33%", income: "$235,676+" },
  ]

  // Basic personal amounts for 2025 (equivalent to standard deductions)
  const basicPersonalAmounts = [
    { category: "Basic Personal Amount (Income < $173,205)", amount: "$15,705" },
    { category: "Basic Personal Amount (Income ≥ $246,752)", amount: "$13,521" },
    { category: "Basic Personal Amount (Between $173,205 and $246,752)", amount: "Graduated" },
    { category: "Age Amount (65+ with income < $42,335)", amount: "$8,292" },
    { category: "Spouse or Common-Law Partner Amount", amount: "Up to $15,705" },
  ]

  // Canadian provincial brackets (Ontario example for 2025)
  const ontarioBrackets = [
    { rate: "5.05%", income: "$0 - $49,231" },
    { rate: "9.15%", income: "$49,232 - $98,463" },
    { rate: "11.16%", income: "$98,464 - $150,000" },
    { rate: "12.16%", income: "$150,001 - $220,000" },
    { rate: "13.16%", income: "$220,001+" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">2025 Canadian Federal Income Tax Brackets</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tax Rate</TableHead>
              <TableHead>Taxable Income Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {canadianFederalBrackets.map((bracket, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bracket.rate}</TableCell>
                <TableCell>{bracket.income}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">2025 Basic Personal Amounts</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Category</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {basicPersonalAmounts.map((deduction, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{deduction.category}</TableCell>
                <TableCell>{deduction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">2025 Ontario Provincial Tax Brackets</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tax Rate</TableHead>
              <TableHead>Taxable Income Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ontarioBrackets.map((bracket, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bracket.rate}</TableCell>
                <TableCell>{bracket.income}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-2">
          Note: Provincial tax rates vary by province or territory. Ontario is shown as an example.
        </p>
      </div>
    </div>
  )
}

