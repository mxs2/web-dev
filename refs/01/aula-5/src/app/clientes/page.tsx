"use client"
import { useEffect, useState } from "react"
import { Table } from "@chakra-ui/react"

export default function ClientsPage() {

    // const clients = [];
    const [clients, setClients] = useState([])

    const fetchClients = async () => {
        const res = await fetch("/api/clientes")
        const bananinha = await res.json()
        console.log(bananinha)
        setClients(bananinha.data)
    }

    useEffect(() => {
        fetchClients()
    }, [])

    return (
        <div>
            <h1>Página de Detalhes de Clientes</h1>
            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                    <Table.ColumnHeader>Nome</Table.ColumnHeader>
                    <Table.ColumnHeader>Email</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Status</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {clients.map((client) => (
                    <Table.Row key={client.id}>
                        <Table.Cell>{client.nome}</Table.Cell>
                        <Table.Cell>{client.email}</Table.Cell>
                        <Table.Cell textAlign="end">{client.ativo ? "ativo" : "desativado"}</Table.Cell>
                    </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
        
        
    )
}