"use client";
import { Tutor } from "@/types";
import { Card, Chip, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  const router = useRouter();

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <Card.Header className="gap-3">
        <div className="relative w-14 h-14 shrink-0">
          <Image
            src={tutor.photo || "https://i.pravatar.cc/56"}
            alt={tutor.name}
            fill
            className="rounded-full object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Card.Title className="text-base truncate">{tutor.name}</Card.Title>
          <Card.Description className="text-xs truncate">
            {tutor.institution}
          </Card.Description>
        </div>
      </Card.Header>

      <Card.Content className="flex-1 flex flex-col gap-2 pt-0">
        <div className="flex flex-wrap gap-1">
          <Chip size="sm" variant="soft" color="accent">
            {tutor.subject}
          </Chip>
          <Chip size="sm" variant="secondary">
            {tutor.teachingMode}
          </Chip>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            🕐 {tutor.availableDays} · {tutor.availableTime}
          </p>
          <p>📍 {tutor.location}</p>
          <p>💼 {tutor.experience} experience</p>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="font-bold text-blue-600 text-lg">
            ৳{tutor.hourlyFee}
            <span className="text-xs font-normal text-gray-500">/hr</span>
          </span>
          <Chip
            size="sm"
            color={tutor.totalSlot > 0 ? "success" : "danger"}
            variant="soft"
          >
            {tutor.totalSlot > 0 ? `${tutor.totalSlot} slots` : "Full"}
          </Chip>
        </div>
      </Card.Content>

      <Card.Footer className="pt-0">
        <Button
          variant="primary"
          className="w-full"
          onPress={() => router.push(`/tutors/${tutor._id}`)}
        >
          Book Session
        </Button>
      </Card.Footer>
    </Card>
  );
}
