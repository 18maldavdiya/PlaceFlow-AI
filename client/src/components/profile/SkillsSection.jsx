import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Search, Tags, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { SelectInput } from "@/components/common/SelectInput";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  PROFILE_QUERY_KEY,
  SKILL_CATEGORY_LABELS,
  SKILL_CATEGORY_OPTIONS,
} from "@/constants/profile";
import { addSkill, deleteSkill, updateSkill } from "@/services/profileService";
import { skillSchema } from "@/utils/validationSchemas";

export function SkillsSection({ profile, isLoading }) {
  const queryClient = useQueryClient();
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: { category: "", name: "" },
  });

  function invalidateAndReset() {
    queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    reset({ category: "", name: "" });
    setEditingSkillId(null);
  }

  const addMutation = useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      toast.success("Skill added.");
      invalidateAndReset();
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't add that skill."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ skillId, payload }) => updateSkill(skillId, payload),
    onSuccess: () => {
      toast.success("Skill updated.");
      invalidateAndReset();
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't update that skill."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      toast.success("Skill removed.");
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't remove that skill."),
  });

  function onSubmit(values) {
    if (editingSkillId) {
      updateMutation.mutate({ skillId: editingSkillId, payload: values });
    } else {
      addMutation.mutate(values);
    }
  }

  function startEdit(skill) {
    setEditingSkillId(skill.id);
    reset({ category: skill.category, name: skill.name });
  }

  function cancelEdit() {
    setEditingSkillId(null);
    reset({ category: "", name: "" });
  }

  const skills = profile?.skills;
  const filteredSkills = useMemo(() => {
    const list = skills ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter((skill) => skill.name.toLowerCase().includes(query));
  }, [skills, search]);

  const groupedByCategory = useMemo(() => {
    return SKILL_CATEGORY_OPTIONS.map((option) => ({
      category: option.value,
      label: option.label,
      items: filteredSkills.filter((skill) => skill.category === option.value),
    })).filter((group) => group.items.length > 0);
  }, [filteredSkills]);

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <DashboardCard title="Technical skills">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid grid-cols-1 gap-3 sm:grid-cols-[1.2fr_1fr_auto]"
      >
        <SelectInput
          label="Category"
          options={SKILL_CATEGORY_OPTIONS}
          error={errors.category?.message}
          {...register("category")}
        />
        <FormInput
          label="Skill name"
          error={errors.name?.message}
          {...register("name")}
        />
        <div className="flex items-end gap-2">
          <Button
            type="submit"
            variant="gradient"
            size="md"
            isLoading={isSubmitting}
            className="h-11 flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {editingSkillId ? "Update" : "Add"}
          </Button>
          {editingSkillId && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              className="h-11"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="relative mt-5">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your skills..."
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="mt-5 space-y-5">
        {isLoading ? (
          <p className="text-sm text-muted">Loading skills...</p>
        ) : groupedByCategory.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Tags className="h-8 w-8 text-muted" aria-hidden />
            <p className="text-sm text-muted">
              {!skills || skills.length === 0
                ? "No skills added yet — add your first one above."
                : "No skills match your search."}
            </p>
          </div>
        ) : (
          groupedByCategory.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {SKILL_CATEGORY_LABELS[group.category] ?? group.label}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <motion.span
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-1.5 pl-3 pr-1.5 text-sm text-foreground"
                  >
                    <button
                      type="button"
                      onClick={() => startEdit(skill)}
                      className="max-w-[16rem] truncate text-left hover:text-primary"
                    >
                      {skill.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(skill.id)}
                      aria-label={`Remove ${skill.name}`}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                      <X className="h-3 w-3" aria-hidden />
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  );
}

export default SkillsSection;
