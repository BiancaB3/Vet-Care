import api from "./api";
import { Usuario } from "../types/usuarios";
import axios from "axios";

export async function buscarListaUsuarios(): Promise<Usuario[]> {
  const resposta = await api.get<Usuario[]>("/usuarios");

  if (resposta.status === 200) {
    return resposta.data;
  }

  return [];
}

export async function alterarStatusUsuario(usuario: Usuario): Promise<void> {
  const novoStatus =
    usuario.status === "ATIVO" ? { status: "INATIVO" } : { status: "ATIVO" };

  const resposta = await api.put(
    `/usuarios/${usuario.id}/AlterarStatus`,
    novoStatus,
  );

  if (resposta.status !== 200) {
    alert("Erro ao atualizar status!");
  }
}

export async function buscarUsuarioPorId(id: number): Promise<Usuario | null> {
  try {
    const resposta = await api.get<Usuario>(`/usuarios/${id}`);

    if (resposta.status === 200) {
      return resposta.data;
    }
  } catch (error) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
  }

  return null;
}

export async function salvarUsuario(
  usuario: Usuario,
  isEdicao: boolean,
): Promise<boolean> {
  try {
    const resposta = isEdicao
      ? await api.put(`/usuarios/${usuario.id}`, usuario)
      : await api.post("/usuarios", usuario);

    return resposta.status === 200 || resposta.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const erroDoBackend = error.response.data;
      throw new Error(
        typeof erroDoBackend === "string"
          ? erroDoBackend
          : "Erro ao salvar usuário.",
      );
    }

    console.error("Erro inesperado no service:", error);
    throw new Error("Erro de conexão com o servidor. Tente novamente.");
  }
}

export async function buscarUsuarioLogado(): Promise<Usuario> {
  const resposta = await api.get<Usuario>("/usuarios/usuariologado");
  return resposta.data;
}