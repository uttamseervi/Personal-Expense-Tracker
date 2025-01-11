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
import CreateBudget from "./createBudget";

export function CreateBudgetButton() {

    return (
        (<div className="py-40 w-full flex items-center justify-center">
            <Modal>
                <ModalTrigger
                    className="bg-transparent dark:text-black text-white flex justify-center p-2  ">
                    <span
                        className="text-center ">
                        Create New Budget
                    </span>

                </ModalTrigger>
                <ModalBody>
                    <ModalContent>
                        <CreateBudget />
                    </ModalContent>

                </ModalBody>
            </Modal>
        </div>)
    );
}
