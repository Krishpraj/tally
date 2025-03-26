"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TaxBreakdownTable() {
  // Tax bracket data for 2023
  const singleFilerBrackets = [
    { rate: "10%", income: "$0 - $11,000" },
    { rate: "12%", income: "$11,001 - $44,725" },
    { rate: "22%", income: "$44,726 - $95,375" },
    { rate: "24%", income: "$95,376 - $182,100" },
    { rate: "32%", income: "$182,101 - $231,250" },
    { rate: "35%", income: "$231,251 - $578,125" },
    { rate: "37%", income: "$578,126+" },
  ]

  // Standard deduction data for 2023
  const standardDeductions = [
    { filingStatus: "Single", amount: "$13,850" },
    { filingStatus: "Married Filing Jointly", amount: "$27,700" },
    { filingStatus: "Married Filing Separately", amount: "$13,850" },
    { filingStatus: "Head of Household", amount: "$20,800" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">2023 Federal Income Tax Brackets (Single Filer)</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tax Rate</TableHead>
              <TableHead>Taxable Income Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {singleFilerBrackets.map((bracket, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bracket.rate}</TableCell>
                <TableCell>{bracket.income}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">2023 Standard Deduction</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Filing Status</TableHead>
              <TableHead>Deduction Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standardDeductions.map((deduction, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{deduction.filingStatus}</TableCell>
                <TableCell>{deduction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

