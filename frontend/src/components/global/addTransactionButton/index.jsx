"use client";
import React from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
} from "@/components/ui/animated-modal";
import { IconMapPlus } from "@tabler/icons-react"
import Image from "next/image";
import { motion } from "framer-motion";
import AddTransaction from "./addTransaction";

export default function AddTransactionButton() {

    return (
        (<div className=" flex items-center justify-center">
            <Modal>
                <ModalTrigger
                    className="bg-blue-500 p-4 text-white flex justify-center group/modal-btn hover:bg-blue-700  ">
                    <button>Add new Transaction</button>
                </ModalTrigger>
                <ModalBody>
                    <ModalContent>
                        <AddTransaction />
                    </ModalContent>

                </ModalBody>
            </Modal>
        </div>)
    );
}

